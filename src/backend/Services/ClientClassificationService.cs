using INERI.Backend.Models;
using INERI.Backend.Repositories;
using INERI.Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using INERI.Backend.Services.Interfaces;

namespace INERI.Backend.Services;

public interface IClientClassificationService
{
    Task<List<ClientResponseDTO>> GetPriorityClientsAsync(long advisorId);
    Task<List<ClientResponseDTO>> GetHighInvestmentVolumeClientsAsync(long advisorId);
    Task<List<ClientResponseDTO>> GetCriticalMismatchClientsAsync(long advisorId);
    Task<List<ClientResponseDTO>> GetHighFinancialExposureClientsAsync(long advisorId);
    Task<ClientClassificationSummaryDTO> GetClientClassificationSummaryAsync(long advisorId);
    Task<List<ClientResponseDTO>> GetRandomClientsFromAllAdvisorsAsync(int limit);
}

public class ClientClassificationService : IClientClassificationService
{
    private readonly IClientRepository _clientRepository;
    private readonly IRiskProfileService _riskProfileService;
    private readonly ClientService _clientService;
    private readonly IAdvisorRepository _advisorRepository;

    // Thresholds for classifications
    private const decimal HIGH_INVESTMENT_THRESHOLD = 1000000M; // 1 milhão
    private const decimal CRITICAL_MISMATCH_THRESHOLD = 40M; // 40%
    private const decimal HIGH_EXPOSURE_THRESHOLD = 0.7M; // 70% em um único tipo de ativo
    private const decimal MAX_PATRIMONY_THRESHOLD = 50000000M; // 50 milhões - limite máximo para inclusão

    // Nova constante para limitar o número de clientes na busca aleatória global
    private const int NUMBER_OF_RANDOM_CLIENTS_TO_FETCH_GLOBAL = 100; // Aumentado de 50 para 100
    // Constante para limitar o número de clientes randomizados no sumário (agora de todos os assessores)
    private const int NUMBER_OF_RANDOM_CLIENTS_FOR_SUMMARY = 200; // Aumentado de 100 para 200 para compensar os filtros

    public ClientClassificationService(
        IClientRepository clientRepository,
        IRiskProfileService riskProfileService,
        ClientService clientService,
        IAdvisorRepository advisorRepository)
    {
        _clientRepository = clientRepository;
        _riskProfileService = riskProfileService;
        _clientService = clientService;
        _advisorRepository = advisorRepository;
    }

    public async Task<List<ClientResponseDTO>> GetPriorityClientsAsync(long advisorId)
    {
        Console.WriteLine($">>> GetPriorityClientsAsync chamado para advisorId: {advisorId}");
        // Reutiliza a lógica de priorização do ClientService
        // NOTA: Se ClientService.CalculatePriorityClientsAsync tem ordenação, ela prevalecerá.
        return await _clientService.CalculatePriorityClientsAsync(advisorId);
    }

    public async Task<List<ClientResponseDTO>> GetHighInvestmentVolumeClientsAsync(long advisorId)
    {
        var clients = await _clientRepository.GetByAdvisorIdAsync(advisorId);
        var highInvestmentClients = new List<ClientResponseDTO>();

        foreach (var client in clients)
        {
            var clientWithInvestments = await _clientRepository.GetWithInvestmentsAsync(client.Id);
            if (clientWithInvestments == null) continue;

            var totalPatrimony = clientWithInvestments.Investimentos
                .Sum(i => i.Quantidade * i.Ativo.PrecoAtual);

            if (totalPatrimony >= HIGH_INVESTMENT_THRESHOLD)
            {
                var dto = await CreateClientResponseDTO(client.Id, totalPatrimony);
                highInvestmentClients.Add(dto);
            }
        }
        // Este método tem sua própria ordenação por Patrimonio.
        // Se desejar randomizar aqui também, remova .OrderByDescending(c => c.Patrimonio)
        return highInvestmentClients.OrderByDescending(c => c.Patrimonio).ToList(); 
    }

    public async Task<List<ClientResponseDTO>> GetCriticalMismatchClientsAsync(long advisorId)
    {
        var clients = await _clientRepository.GetByAdvisorIdAsync(advisorId);
        var criticalMismatchClients = new List<ClientResponseDTO>();

        foreach (var client in clients)
        {
            var mismatchPercentage = await _riskProfileService.GetMismatchPercentageAsync(client.Id);
            
            if (mismatchPercentage >= CRITICAL_MISMATCH_THRESHOLD)
            {
                var clientWithInvestments = await _clientRepository.GetWithInvestmentsAsync(client.Id);
                if (clientWithInvestments == null) continue;

                var totalPatrimony = clientWithInvestments.Investimentos
                    .Sum(i => i.Quantidade * i.Ativo.PrecoAtual);

                var dto = await CreateClientResponseDTO(client.Id, totalPatrimony);
                criticalMismatchClients.Add(dto);
            }
        }
        // Este método tem sua própria ordenação por PercentualDesenquadramento.
        // Se desejar randomizar aqui também, remova .OrderByDescending(c => c.PercentualDesenquadramento)
        return criticalMismatchClients.OrderByDescending(c => c.PercentualDesenquadramento).ToList();
    }

    public async Task<List<ClientResponseDTO>> GetHighFinancialExposureClientsAsync(long advisorId)
    {
        var clients = await _clientRepository.GetByAdvisorIdAsync(advisorId);
        var highExposureClients = new List<ClientResponseDTO>();

        foreach (var client in clients)
        {
            var clientWithInvestments = await _clientRepository.GetWithInvestmentsAsync(client.Id);
            if (clientWithInvestments == null || !clientWithInvestments.Investimentos.Any()) continue;

            var totalPatrimony = clientWithInvestments.Investimentos
                .Sum(i => i.Quantidade * i.Ativo.PrecoAtual);

            // Group investments by asset type and calculate exposure percentage
            var exposureByType = clientWithInvestments.Investimentos
                .GroupBy(i => i.Ativo.Tipo)
                .Select(g => new
                {
                    AssetType = g.Key,
                    TotalValue = g.Sum(i => i.Quantidade * i.Ativo.PrecoAtual),
                    Percentage = g.Sum(i => i.Quantidade * i.Ativo.PrecoAtual) / totalPatrimony
                })
                .OrderByDescending(x => x.Percentage)
                .FirstOrDefault();

            if (exposureByType?.Percentage >= HIGH_EXPOSURE_THRESHOLD)
            {
                var dto = await CreateClientResponseDTO(client.Id, totalPatrimony);
                highExposureClients.Add(dto);
            }
        }
        // Este método tem sua própria ordenação por Patrimonio.
        // Se desejar randomizar aqui também, remova .OrderByDescending(c => c.Patrimonio)
        return highExposureClients.OrderByDescending(c => c.Patrimonio).ToList();
    }

    private string GetProfileFromRisk(int? risk)
    {
        if (!risk.HasValue) return "Indefinido";
        if (risk.Value <= 3) return "Conservador";
        if (risk.Value <= 6) return "Moderado";
        if (risk.Value <= 8) return "Arrojado";
        return "Agressivo";
    }

    public async Task<ClientClassificationSummaryDTO> GetClientClassificationSummaryAsync(long advisorId)
    {
        Console.WriteLine($">>> GetClientClassificationSummaryAsync chamado para advisorId: {advisorId}");
        // Buscar preferências do assessor (ainda útil para os pesos de prioridade, mesmo que os clientes venham de todo o banco)
        var advisor = await _advisorRepository.GetByIdAsync(advisorId);
        int pVolume = advisor?.PreferenciaVolumeInvestido ?? 33;
        int pDesenq = advisor?.PreferenciaNivelDesenquadramento ?? 33;
        int pTempo = advisor?.PreferenciaTempoSemContato ?? 34;

        decimal total = pVolume + pDesenq + pTempo;
        if (total == 0)
        {
            pVolume = 33; pDesenq = 33; pTempo = 34;
            total = 100;
        }
        decimal pesoVolume = pVolume / total;
        decimal pesoDesenq = pDesenq / total;
        decimal pesoTempo = pTempo / total;
        Console.WriteLine($"Pesos: Volume={pesoVolume}, Desenq={pesoDesenq}, Tempo={pesoTempo}");

        // --- MUDANÇA CRÍTICA AQUI: Removendo o filtro por AssessorId para puxar de TODOS os assessores ---
        var clientes = await _clientRepository
            .GetQueryable()
            .AsNoTracking()
            // REMOVIDO: .Where(c => c.AssessorId == advisorId) 
            .OrderBy(c => Guid.NewGuid()) // Randomiza a ordem dos clientes antes de pegar uma amostra
            .Take(NUMBER_OF_RANDOM_CLIENTS_FOR_SUMMARY) // Limita o número de clientes processados para performance
            .Select(c => new {
                c.Id,
                c.Nome,
                Investimentos = c.Investimentos.Select(i => new {
                    i.Quantidade,
                    PrecoAtual = i.Ativo.PrecoAtual,
                    TipoAtivo = i.Ativo.Tipo,
                    RiscoAtivo = i.Ativo.Risco
                }).ToList(),
                HistoricoRiscoCalculado = c.HistoricosRiscoCalculado
                    .OrderByDescending(h => h.DataCalculo)
                    .Select(h => new { h.RiscoCalculado, h.DataCalculo })
                    .FirstOrDefault(),
                HistoricoRiscoDeclarado = c.HistoricosRiscoDeclarado
                    .OrderByDescending(h0 => h0.DataDeclaracao)
                    .Select(h0 => new { h0.RiscoDeclarado, h0.DataDeclaracao })
                    .FirstOrDefault(),
                c.DataCriacao
            })
            .ToListAsync();

        var highInvestmentClients = new List<ClientResponseDTO>();
        var criticalMismatchClients = new List<ClientResponseDTO>();
        var highExposureClients = new List<ClientResponseDTO>();
        ClientResponseDTO? priorityClient = null;

        foreach (var c in clientes)
        {
            var totalPatrimony = c.Investimentos.Sum(i => i.Quantidade * i.PrecoAtual);
            var latestDeclared = c.HistoricoRiscoDeclarado?.RiscoDeclarado;
            var latestCalculated = c.HistoricoRiscoCalculado?.RiscoCalculado;
            var ultimaAtualizacao = c.HistoricoRiscoCalculado?.DataCalculo ?? c.HistoricoRiscoDeclarado?.DataDeclaracao;

            // FILTROS: Excluir clientes com patrimônio acima de 50 milhões ou com "?" no nome
            if (totalPatrimony > MAX_PATRIMONY_THRESHOLD || c.Nome.Contains("?"))
                continue;

            // FILTRO: Excluir clientes com ativos negativos (quantidade ou preço negativo)
            var temAtivosNegativos = c.Investimentos.Any(i => i.Quantidade < 0 || i.PrecoAtual < 0);
            if (temAtivosNegativos)
                continue;

            var calc = latestCalculated.HasValue ? Math.Clamp(latestCalculated.Value, 1, 10) : 0;
            var decl = latestDeclared.HasValue ? Math.Clamp(latestDeclared.Value, 1, 10) : 0; 
            decimal percentualDesenquadramento = 0;
            if (decl > 0)
            {
                percentualDesenquadramento = Math.Abs(calc - decl) / 10m * 100;
            }

            if (percentualDesenquadramento == 0)
                continue;

            decimal riscoCarteiraAtual = 0;
            decimal totalValue = c.Investimentos.Sum(i => i.Quantidade * i.PrecoAtual);
            if (totalValue > 0)
            {
                riscoCarteiraAtual = c.Investimentos.Sum(i => (i.Quantidade * i.PrecoAtual) * ((i.RiscoAtivo - 1) / 9m)) / totalValue;
            }

            decimal scorePrioridade = (percentualDesenquadramento * pesoDesenq) +
                                      ((totalPatrimony / 1000000m) * 100 * pesoVolume) +
                                      ((decimal)((DateTime.UtcNow - c.DataCriacao).TotalDays / 30.0) * 100 * pesoTempo);
            Console.WriteLine($"Cliente {c.Id} - {c.Nome}: mismatch={percentualDesenquadramento}, patrimonio={(totalPatrimony / 1000000m) * 100}, tempo={(decimal)((DateTime.UtcNow - c.DataCriacao).TotalDays / 30.0) * 100}, score={scorePrioridade}");

            var perfilDeInvestidor = GetProfileFromRisk(latestDeclared);
            var perfilCarteira = GetProfileFromRisk(latestCalculated);

            var dto = new ClientResponseDTO
            {
                Id = c.Id,
                Nome = c.Nome,
                PerfilDeInvestidor = perfilDeInvestidor,
                PerfilCarteira = perfilCarteira,
                Patrimonio = totalPatrimony,
                RiscoDeclarado = latestDeclared,
                RiscoCalculado = latestCalculated,
                RiscoCarteiraAtual = riscoCarteiraAtual,
                PercentualDesenquadramento = percentualDesenquadramento,
                IsDesenquadrado = percentualDesenquadramento > 40,
                UltimaAtualizacaoRisco = ultimaAtualizacao,
                ScorePrioridade = scorePrioridade
            };

            if (totalPatrimony >= HIGH_INVESTMENT_THRESHOLD)
                highInvestmentClients.Add(dto);

            if (percentualDesenquadramento >= CRITICAL_MISMATCH_THRESHOLD)
                criticalMismatchClients.Add(dto);

            var maiorExposicao = c.Investimentos
                .GroupBy(i => i.TipoAtivo)
                .Select(g => g.Sum(i => i.Quantidade * i.PrecoAtual) / (totalPatrimony == 0 ? 1 : totalPatrimony))
                .DefaultIfEmpty(0).Max();
            if (maiorExposicao >= HIGH_EXPOSURE_THRESHOLD)
                highExposureClients.Add(dto);
        }

        // Removidas as ordenações explícitas para manter a randomização
        highInvestmentClients = highInvestmentClients.Take(10).ToList();
        criticalMismatchClients = criticalMismatchClients.Take(10).ToList();
        highExposureClients = highExposureClients.Take(10).ToList();

        // Prioridade: o primeiro cliente desenquadrado encontrado na ordem aleatória processada
        var clientesPrioritarios = highInvestmentClients
            .Where(c => c.PercentualDesenquadramento > 0)
            .ToList(); 
        priorityClient = clientesPrioritarios.FirstOrDefault();


        return new ClientClassificationSummaryDTO
        {
            PriorityClient = priorityClient,
            HighInvestmentCount = highInvestmentClients.Count,
            CriticalMismatchCount = criticalMismatchClients.Count,
            HighExposureCount = highExposureClients.Count,
            Classifications = new List<ClientClassificationDTO>
            {
                new()
                {
                    Title = "Grande Volume de Investimento",
                    Subtitle = "Clientes com quantias significativas investidas",
                    Icon = "dollar-sign",
                    Clients = highInvestmentClients
                },
                new()
                {
                    Title = "Desenquadramento Crítico",
                    Subtitle = "Clientes com alto desenquadramento do perfil (> 40%)",
                    Icon = "triangle-alert",
                    Clients = criticalMismatchClients
                },
                new()
                {
                    Title = "Alta Exposição Financeira",
                    Subtitle = "Clientes concentrados em poucos ativos",
                    Icon = "chart-pie",
                    Clients = highExposureClients
                }
            }
        };
    }

    public async Task<List<ClientResponseDTO>> GetRandomClientsFromAllAdvisorsAsync(int limit)
    {
        Console.WriteLine($">>> GetRandomClientsFromAllAdvisorsAsync chamado para {limit} clientes aleatórios.");

        var randomClients = await _clientRepository
            .GetQueryable()
            .AsNoTracking()
            .OrderBy(c => Guid.NewGuid()) 
            .Take(limit) 
            .Select(c => new {
                c.Id,
                c.Nome,
                Investimentos = c.Investimentos.Select(i => new {
                    i.Quantidade,
                    PrecoAtual = i.Ativo.PrecoAtual,
                    TipoAtivo = i.Ativo.Tipo,
                    RiscoAtivo = i.Ativo.Risco
                }).ToList(),
                HistoricoRiscoCalculado = c.HistoricosRiscoCalculado
                    .OrderByDescending(h => h.DataCalculo)
                    .Select(h => new { h.RiscoCalculado, h.DataCalculo })
                    .FirstOrDefault(),
                HistoricoRiscoDeclarado = c.HistoricosRiscoDeclarado
                    .OrderByDescending(h0 => h0.DataDeclaracao)
                    .Select(h0 => new { h0.RiscoDeclarado, h0.DataDeclaracao })
                    .FirstOrDefault(),
                c.DataCriacao
            })
            .ToListAsync();

        var clientResponseDTOs = new List<ClientResponseDTO>();

        foreach (var c in randomClients)
        {
            var totalPatrimony = c.Investimentos.Sum(i => i.Quantidade * i.PrecoAtual);
            var latestDeclared = c.HistoricoRiscoDeclarado?.RiscoDeclarado;
            var latestCalculated = c.HistoricoRiscoCalculado?.RiscoCalculado;
            var ultimaAtualizacao = c.HistoricoRiscoCalculado?.DataCalculo ?? c.HistoricoRiscoDeclarado?.DataDeclaracao;

            // FILTROS: Excluir clientes com patrimônio acima de 50 milhões ou com "?" no nome
            if (totalPatrimony > MAX_PATRIMONY_THRESHOLD || c.Nome.Contains("?"))
                continue;

            // FILTRO: Excluir clientes com ativos negativos (quantidade ou preço negativo)
            var temAtivosNegativos = c.Investimentos.Any(i => i.Quantidade < 0 || i.PrecoAtual < 0);
            if (temAtivosNegativos)
                continue;

            var calc = latestCalculated.HasValue ? Math.Clamp(latestCalculated.Value, 1, 10) : 0;
            var decl = latestDeclared.HasValue ? Math.Clamp(latestDeclared.Value, 1, 10) : 0;
            decimal percentualDesenquadramento = 0;
            if (decl > 0)
            {
                percentualDesenquadramento = Math.Abs(calc - decl) / 10m * 100;
            }

            decimal riscoCarteiraAtual = 0;
            decimal totalValue = c.Investimentos.Sum(i => i.Quantidade * i.PrecoAtual);
            if (totalValue > 0)
            {
                riscoCarteiraAtual = c.Investimentos.Sum(i => (i.Quantidade * i.PrecoAtual) * ((i.RiscoAtivo - 1) / 9m)) / totalValue;
            }
            
            var perfilDeInvestidor = GetProfileFromRisk(latestDeclared);
            var perfilCarteira = GetProfileFromRisk(latestCalculated);

            clientResponseDTOs.Add(new ClientResponseDTO
            {
                Id = c.Id,
                Nome = c.Nome,
                PerfilDeInvestidor = perfilDeInvestidor,
                PerfilCarteira = perfilCarteira,
                Patrimonio = totalPatrimony,
                RiscoDeclarado = latestDeclared,
                RiscoCalculado = latestCalculated,
                RiscoCarteiraAtual = riscoCarteiraAtual,
                PercentualDesenquadramento = percentualDesenquadramento,
                IsDesenquadrado = percentualDesenquadramento > 40,
                UltimaAtualizacaoRisco = ultimaAtualizacao,
                ScorePrioridade = 0 
            });
        }

        return clientResponseDTOs;
    }

    private async Task<ClientResponseDTO> CreateClientResponseDTO(long clientId, decimal totalPatrimony)
    {
        return new ClientResponseDTO
        {
            Id = clientId,
            Nome = (await _clientRepository.GetByIdAsync(clientId))?.Nome ?? string.Empty,
            PerfilDeInvestidor = await _riskProfileService.GetInvestorProfileAsync(clientId),
            Patrimonio = totalPatrimony,
            PerfilCarteira = await _riskProfileService.GetPortfolioProfileAsync(clientId),
            RiscoCarteiraAtual = await _riskProfileService.GetPortfolioRiskAsync(clientId),
            PercentualDesenquadramento = await _riskProfileService.GetMismatchPercentageAsync(clientId),
            IsDesenquadrado = await _riskProfileService.IsClientMismatchedAsync(clientId)
        };
    }
}