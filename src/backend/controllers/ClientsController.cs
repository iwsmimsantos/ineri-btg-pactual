using Microsoft.AspNetCore.Mvc;
using INERI.Backend.Models;
using INERI.Backend.Repositories;
using INERI.Backend.Services;
using AutoMapper;
using INERI.Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using INERI.Backend.Data;
using INERI.Backend.Services.Interfaces;

namespace INERI.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly IClientRepository _clientRepository;
    private readonly IRiskProfileService _riskProfileService;
    private readonly ClientService _clientService;
    private readonly IMapper _mapper;
    private readonly InvestmentDbContext _context;

    public ClientsController(
        IClientRepository clientRepository,
        IRiskProfileService riskProfileService,
        ClientService clientService,
        IMapper mapper,
        InvestmentDbContext context)
    {
        _clientRepository = clientRepository;
        _riskProfileService = riskProfileService;
        _clientService = clientService;
        _mapper = mapper;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClientResponseDTO>>> GetClients()
    {
        var clients = await _clientRepository.GetAllAsync();
        var dtos = new List<ClientResponseDTO>();

        foreach (var client in clients)
        {
            var dto = _mapper.Map<ClientResponseDTO>(client);

            // Use enhanced risk calculation
            dto.PerfilDeInvestidor = await _riskProfileService.GetInvestorProfileAsync(client.Id);
            dto.PerfilCarteira = await _riskProfileService.GetPortfolioProfileAsync(client.Id);
            dto.RiscoCarteiraAtual = await _riskProfileService.GetPortfolioRiskAsync(client.Id);
            dto.PercentualDesenquadramento = await _riskProfileService.GetMismatchPercentageAsync(client.Id);
            dto.IsDesenquadrado = await _riskProfileService.IsClientMismatchedAsync(client.Id);

            dtos.Add(dto);
        }

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClientResponseDTO>> GetClient(long id)
    {
        var client = await _clientRepository.GetByIdAsync(id);

        if (client == null)
        {
            return NotFound();
        }

        var dto = _mapper.Map<ClientResponseDTO>(client);

        // Add risk profile information
        dto.PerfilDeInvestidor = await _riskProfileService.GetInvestorProfileAsync(id);
        dto.PerfilCarteira = await _riskProfileService.GetPortfolioProfileAsync(id);
        dto.RiscoCarteiraAtual = await _riskProfileService.GetPortfolioRiskAsync(id);
        dto.PercentualDesenquadramento = await _riskProfileService.GetMismatchPercentageAsync(id);
        dto.IsDesenquadrado = await _riskProfileService.IsClientMismatchedAsync(id);

        return Ok(dto);
    }

    [HttpGet("{id}/risk-factors")]
    public async Task<ActionResult<Dictionary<string, decimal>>> GetClientRiskFactors(long id)
    {
        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null)
        {
            return NotFound();
        }

        var riskFactors = await _riskProfileService.GetRiskFactorsAsync(id);
        return Ok(riskFactors);
    }

    [HttpPost("{id}/calculate-risk")]
    public async Task<ActionResult<CalculatedRiskHistory>> CalculateAndSaveRisk(long id)
    {
        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null)
        {
            return NotFound();
        }

        var riskScore = await _riskProfileService.CalculateAdvancedRiskScoreAsync(id);
        var riskFactors = await _riskProfileService.GetRiskFactorsAsync(id);

        var calculatedRisk = await _riskProfileService.SaveCalculatedRiskAsync(id, riskScore, riskFactors);

        return Ok(calculatedRisk);
    }

    [HttpGet("{id}/risk-history")]
    public async Task<ActionResult<object>> GetClientRiskHistory(long id)
    {
        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null)
        {
            return NotFound();
        }

        var calculatedHistory = await _clientRepository.GetCalculatedRiskHistoryAsync(id);
        var declaredHistory = await _clientRepository.GetDeclaredRiskHistoryAsync(id);

        return Ok(new
        {
            CalculatedHistory = calculatedHistory,
            DeclaredHistory = declaredHistory
        });
    }

    [HttpGet("{id}/risk-analysis")]
    public async Task<ActionResult<object>> GetClientRiskAnalysis(long id)
    {
        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null)
        {
            return NotFound();
        }

        var investorProfile = await _riskProfileService.GetInvestorProfileAsync(id);
        var portfolioProfile = await _riskProfileService.GetPortfolioProfileAsync(id);
        var mismatchPercentage = await _riskProfileService.GetMismatchPercentageAsync(id);
        var isSignificantMismatch = await _riskProfileService.IsRiskMismatchSignificantAsync(id);
        var riskFactors = await _riskProfileService.GetRiskFactorsAsync(id);
        var calculatedRiskScore = await _riskProfileService.CalculateAdvancedRiskScoreAsync(id);

        return Ok(new
        {
            InvestorProfile = investorProfile,
            PortfolioProfile = portfolioProfile,
            MismatchPercentage = mismatchPercentage,
            IsSignificantMismatch = isSignificantMismatch,
            RiskFactors = riskFactors,
            CalculatedRiskScore = calculatedRiskScore,
            RiskFactorAnalysis = new
            {
                PortfolioRisk = new {
                    Value = riskFactors.GetValueOrDefault("portfolio_risk", 0),
                    Weight = 0.4m,
                    Description = "Risk baseado na composição da carteira"
                },
                InvestmentDuration = new {
                    Value = riskFactors.GetValueOrDefault("investment_duration", 0),
                    Weight = 0.2m,
                    Description = "Fator baseado na idade do investidor"
                },
                Diversification = new {
                    Value = riskFactors.GetValueOrDefault("diversification", 0),
                    Weight = 0.2m,
                    Description = "Fator de diversificação da carteira"
                },
                MarketExposure = new {
                    Value = riskFactors.GetValueOrDefault("market_exposure", 0),
                    Weight = 0.2m,
                    Description = "Exposição a mercados voláteis"
                }
            }
        });
    }

    [HttpGet("email/{email}")]
    public async Task<ActionResult<Client>> GetClientByEmail(string email)
    {
        var client = await _clientRepository.GetByEmailAsync(email);

        if (client == null)
        {
            return NotFound();
        }

        return Ok(client);
    }

    [HttpGet("cpf/{cpf}")]
    public async Task<ActionResult<Client>> GetClientByCpf(string cpf)
    {
        var client = await _clientRepository.GetByCpfAsync(cpf);

        if (client == null)
        {
            return NotFound();
        }

        return Ok(client);
    }

    [HttpGet("advisor/{advisorId}")]
    public async Task<ActionResult<object>> GetClientsByAdvisor(long advisorId, int page = 1, int pageSize = 10)
    {
        try
        {
            var clients = await _clientRepository.GetByAdvisorIdPagedAsync(advisorId, page, pageSize);
            var totalCount = await _clientRepository.GetCountByAdvisorIdAsync(advisorId);
            var clientIds = clients.Select(c => c.Id).ToList();

            // Buscar todos os dados necessários em uma query só (como no summary da homepage)
            var clientesData = await _clientRepository
                .GetQueryable()
                .AsNoTracking()
                .Where(c => clientIds.Contains(c.Id))
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

            var dtos = new List<ClientResponseDTO>();
            foreach (var c in clientesData)
            {
                var totalPatrimony = c.Investimentos.Sum(i => i.Quantidade * i.PrecoAtual);
                var latestDeclared = c.HistoricoRiscoDeclarado?.RiscoDeclarado;
                var latestCalculated = c.HistoricoRiscoCalculado?.RiscoCalculado;
                var ultimaAtualizacao = c.HistoricoRiscoCalculado?.DataCalculo ?? c.HistoricoRiscoDeclarado?.DataDeclaracao;

                // Percentual desenquadramento (igual summary homepage)
                var calc = latestCalculated.HasValue ? Math.Clamp(latestCalculated.Value, 1, 10) : 0;
                var decl = latestDeclared.HasValue ? Math.Clamp(latestDeclared.Value, 1, 10) : 0;
                decimal percentualDesenquadramento = 0;
                if (decl > 0)
                {
                    percentualDesenquadramento = Math.Abs(calc - decl) / 10m * 100;
                }

                // Risco carteira atual (exemplo: média ponderada dos riscos dos ativos)
                decimal riscoCarteiraAtual = 0;
                decimal totalValue = c.Investimentos.Sum(i => i.Quantidade * i.PrecoAtual);
                if (totalValue > 0)
                {
                    riscoCarteiraAtual = c.Investimentos.Sum(i => (i.Quantidade * i.PrecoAtual) * ((i.RiscoAtivo - 1) / 9m)) / totalValue;
                }

                var perfilDeInvestidor = latestDeclared.HasValue ? (latestDeclared.Value <= 3 ? "Conservador" : latestDeclared.Value <= 6 ? "Moderado" : latestDeclared.Value <= 8 ? "Arrojado" : "Agressivo") : "Indefinido";
                var perfilCarteira = latestCalculated.HasValue ? (latestCalculated.Value <= 3 ? "Conservador" : latestCalculated.Value <= 6 ? "Moderado" : latestCalculated.Value <= 8 ? "Arrojado" : "Agressivo") : "Indefinido";

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
                    UltimaAtualizacaoRisco = ultimaAtualizacao
                };
                dtos.Add(dto);
            }

            return Ok(new {
                clients = dtos,
                totalCount,
                page,
                pageSize
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERRO PAGINADO] {ex.Message}\n{ex.StackTrace}");
            return StatusCode(500, new { error = ex.Message, stack = ex.StackTrace });
        }
    }

    [HttpGet("{id}/investments")]
    public async Task<ActionResult<Client>> GetClientWithInvestments(long id)
    {
        var client = await _clientRepository.GetWithInvestmentsAsync(id);

        if (client == null)
        {
            return NotFound();
        }

        return Ok(client);
    }

    [HttpPost]
    public async Task<ActionResult<Client>> CreateClient(Client client)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingByEmail = await _clientRepository.GetByEmailAsync(client.Email);
        if (existingByEmail != null)
        {
            return Conflict("Email já está em uso");
        }

        var existingByCpf = await _clientRepository.GetByCpfAsync(client.Cpf);
        if (existingByCpf != null)
        {
            return Conflict("CPF já está em uso");
        }

        var createdClient = await _clientRepository.AddAsync(client);
        return CreatedAtAction(nameof(GetClient), new { id = createdClient.Id }, createdClient);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClient(long id, Client client)
    {
        if (id != client.Id)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var exists = await _clientRepository.ExistsAsync(id);
        if (!exists)
        {
            return NotFound();
        }

        await _clientRepository.UpdateAsync(client);
        return NoContent();
    }


}
