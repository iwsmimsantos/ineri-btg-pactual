using System.Linq;
using System.Linq.Expressions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Xunit;
using INERI.Backend.DTOs;
using INERI.Backend.Models;
using INERI.Backend.Repositories;
using INERI.Backend.Services;
using INERI.Backend.Services.Interfaces;

namespace INERI.Backend.Services
{
    public class ClientService
    {
        private readonly IClientRepository _clientRepository;
        private readonly IRiskProfileService _riskProfileService;
        private readonly IAdvisorRepository _advisorRepository;
        private const decimal PESO_DESENQUADRAMENTO = 0.4M;
        private const decimal PESO_PATRIMONIO = 0.3M;
        private const decimal PESO_TEMPO_SEM_CONTATO = 0.3M;

        public ClientService(
            IClientRepository clientRepository,
            IRiskProfileService riskProfileService,
            IAdvisorRepository advisorRepository)
        {
            _clientRepository = clientRepository;
            _riskProfileService = riskProfileService;
            _advisorRepository = advisorRepository;
        }

        public async Task<Client?> GetClientProfileAsync(long clientId)
        {
            return await _clientRepository.GetByIdAsync(clientId);
        }

        public async Task<IEnumerable<Client>> GetAllClientsAsync()
        {
            return await _clientRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Client>> FindClientsAsync(Expression<Func<Client, bool>> predicate)
        {
            return await _clientRepository.FindAsync(predicate);
        }

        public async Task<Client> AddClientAsync(Client client)
        {
            return await _clientRepository.AddAsync(client);
        }

        public async Task UpdateClientAsync(Client client)
        {
            await _clientRepository.UpdateAsync(client);
        }

        public async Task DeleteClientAsync(long clientId)
        {
            await _clientRepository.DeleteAsync(clientId);
        }

        public async Task<bool> ClientExistsAsync(long clientId)
        {
            return await _clientRepository.ExistsAsync(clientId);
        }

        public async Task<Client?> GetClientByEmailAsync(string email)
        {
            return await _clientRepository.GetByEmailAsync(email);
        }

        public async Task<Client?> GetClientByCpfAsync(string cpf)
        {
            return await _clientRepository.GetByCpfAsync(cpf);
        }

        public async Task<IEnumerable<Client>> GetClientsByAdvisorIdAsync(long advisorId)
        {
            return await _clientRepository.GetByAdvisorIdAsync(advisorId);
        }

        public async Task<Client?> GetClientWithInvestmentsAsync(long clientId)
        {
            return await _clientRepository.GetWithInvestmentsAsync(clientId);
        }

        public async Task<ClientDetailsDTO?> GetClientDetailsAsync(long clientId)
        {
            var client = await _clientRepository.GetWithInvestmentsAsync(clientId);
            if (client == null) return null;

            return new ClientDetailsDTO
            {
                Id = client.Id,
                NomeCompleto = client.Nome,
                Email = client.Email,
                Cpf = client.Cpf,
                SaldoCarteira = client.Investimentos.Sum(i => i.Quantidade * i.PrecoCompra),
                UltimoContato = client.DataCriacao,
                Investments = client.Investimentos.Select(i => new InvestmentDTO
                {
                    Id = i.Id,
                    AtivoId = i.AtivoId,
                    Quantidade = i.Quantidade,
                    PrecoCompra = i.PrecoCompra,
                    DataCompra = i.DataCompra

                }).ToList()
            };
        }

        public async Task<List<ClientResponseDTO>> CalculatePriorityClientsAsync(long advisorId)
        {
            Console.WriteLine(">>> CalculatePriorityClientsAsync chamado para advisorId: " + advisorId);
            var clients = await GetClientsByAdvisorIdAsync(advisorId);
            var priorityClients = new List<ClientResponseDTO>();

            // Buscar preferências do assessor
            var advisor = await _advisorRepository.GetByIdAsync(advisorId);
            int pVolume = advisor?.PreferenciaVolumeInvestido ?? 33;
            int pDesenq = advisor?.PreferenciaNivelDesenquadramento ?? 33;
            int pTempo = advisor?.PreferenciaTempoSemContato ?? 34;

            decimal total = pVolume + pDesenq + pTempo;
            if (total == 0)
            {
                // fallback para pesos padrão
                pVolume = 33; pDesenq = 33; pTempo = 34;
                total = 100;
            }
            decimal pesoVolume = pVolume / total;
            decimal pesoDesenq = pDesenq / total;
            decimal pesoTempo = pTempo / total;

            Console.WriteLine($"Pesos: Volume={pesoVolume}, Desenq={pesoDesenq}, Tempo={pesoTempo}");

            foreach (var client in clients)
            {
                var clientWithRisk = await _clientRepository.GetWithRiskHistoryAsync(client.Id);
                if (clientWithRisk == null) continue;

                var totalPatrimony = clientWithRisk.Investimentos
                    .Sum(i => i.Quantidade * i.Ativo.PrecoAtual);

                var daysWithoutContact = (int)(DateTime.UtcNow - clientWithRisk.DataCriacao).TotalDays;

                // Calculate normalized scores (0-100)
                var mismatchPercentage = await _riskProfileService.GetMismatchPercentageAsync(client.Id);
                var mismatchScore = Math.Min(100, mismatchPercentage);
                var patrimonyScore = Math.Min(100, (totalPatrimony / 1000000) * 100); // Normalize per million
                var contactScore = Math.Min(100, (daysWithoutContact / 30.0M) * 100); // Normalize per month

                // Usar os pesos das preferências
                var finalScore = (mismatchScore * pesoDesenq) +
                                 (patrimonyScore * pesoVolume) +
                                 (contactScore * pesoTempo);

                Console.WriteLine($"Cliente {client.Id} - {client.Nome}: mismatch={mismatchScore}, patrimonio={patrimonyScore}, tempo={contactScore}, score={finalScore}");

                var dto = new ClientResponseDTO
                {
                    Id = client.Id,
                    Nome = client.Nome,
                    PerfilDeInvestidor = await _riskProfileService.GetInvestorProfileAsync(client.Id),
                    Patrimonio = totalPatrimony,
                    PerfilCarteira = await _riskProfileService.GetPortfolioProfileAsync(client.Id),
                    RiscoCarteiraAtual = await _riskProfileService.GetPortfolioRiskAsync(client.Id),
                    PercentualDesenquadramento = mismatchPercentage,
                    IsDesenquadrado = await _riskProfileService.IsClientMismatchedAsync(client.Id),
                    ScorePrioridade = finalScore
                };

                priorityClients.Add(dto);
            }

            return priorityClients.OrderByDescending(c => c.ScorePrioridade).ToList();
        }
    }
}
