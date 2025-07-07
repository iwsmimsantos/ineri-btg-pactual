using INERI.Backend.Models;
using INERI.Backend.Repositories;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace INERI.Backend.Services;

public class RiskProfileService : INERI.Backend.Services.Interfaces.IRiskProfileService
{
    private readonly IClientRepository _clientRepository;
    private readonly ILogger<RiskProfileService>? _logger;

    public RiskProfileService(IClientRepository clientRepository, ILogger<RiskProfileService>? logger = null)
    {
        _clientRepository = clientRepository;
        _logger = logger;
    }

    public async Task<string> GetInvestorProfileAsync(long clientId)
    {
        var client = await _clientRepository.GetWithRiskHistoryAsync(clientId);
        if (client == null) return "Indefinido";

        // Get the most recent declared risk from history
        var latestDeclaredRisk = client.HistoricosRiscoDeclarado
            .OrderByDescending(h => h.DataDeclaracao)
            .FirstOrDefault();

        // Get the most recent calculated risk from history
        var latestCalculatedRisk = client.HistoricosRiscoCalculado
            .OrderByDescending(h => h.DataCalculo)
            .FirstOrDefault();

        // Priority: Use calculated risk if available and recent, otherwise use declared risk
        int? riskScore = null;
        if (latestCalculatedRisk != null &&
            (latestDeclaredRisk == null || latestCalculatedRisk.DataCalculo > latestDeclaredRisk.DataDeclaracao))
        {
            riskScore = latestCalculatedRisk.RiscoCalculado;
        }
        else if (latestDeclaredRisk != null)
        {
            riskScore = latestDeclaredRisk.RiscoDeclarado;
        }

        // If no risk history exists, calculate one based on portfolio and save it
        if (riskScore == null)
        {
            var calculatedScore = await CalculateAdvancedRiskScoreAsync(clientId);
            var riskFactors = await GetRiskFactorsAsync(clientId);

            // Save the calculated risk for future use
            await SaveCalculatedRiskAsync(clientId, calculatedScore, riskFactors);

            riskScore = calculatedScore;
        }

        return ConvertRiskScoreToProfile(riskScore);
    }

    public async Task<string> GetPortfolioProfileAsync(long clientId)
    {
        var portfolioRisk = await GetPortfolioRiskAsync(clientId);
        return ConvertPortfolioRiskToProfile(portfolioRisk);
    }

    public async Task<decimal> GetPortfolioRiskAsync(long clientId)
    {
        var client = await _clientRepository.GetWithInvestmentsAsync(clientId);
        if (client == null || !client.Investimentos.Any())
            return 0;

        // Calculate weighted average risk based on investment amounts
        decimal totalValue = 0;
        decimal weightedRisk = 0;

        foreach (var investment in client.Investimentos)
        {
            var investmentValue = investment.Quantidade * investment.Ativo.PrecoAtual;
            // Ativo.Risco is on 1-10 scale, normalize to 0-1
            var normalizedRisk = (investment.Ativo.Risco - 1) / 9m;
            var riskWeight = investmentValue * normalizedRisk;

            totalValue += investmentValue;
            weightedRisk += riskWeight;
        }

        return totalValue > 0 ? weightedRisk / totalValue : 0;
    }

    public async Task<int> CalculateAdvancedRiskScoreAsync(long clientId)
    {
        var client = await _clientRepository.GetWithInvestmentsAsync(clientId);
        if (client == null) return 1; // Default to lowest risk

        var riskFactors = await GetRiskFactorsAsync(clientId);

        // Weighted calculation of final risk score (0-1 range)
        var weightedScore = (
            riskFactors["portfolio_risk"] * 0.4m +
            riskFactors["investment_duration"] * 0.2m +
            riskFactors["diversification"] * 0.2m +
            riskFactors["market_exposure"] * 0.2m
        );

        // Convert to 1-10 scale (matching database scale)
        var finalScore = (int)Math.Round(weightedScore * 9 + 1);
        return Math.Clamp(finalScore, 1, 10);
    }

    public async Task<Dictionary<string, decimal>> GetRiskFactorsAsync(long clientId)
    {
        var client = await _clientRepository.GetWithInvestmentsAsync(clientId);
        if (client == null) return new Dictionary<string, decimal>();

        return new Dictionary<string, decimal>
        {
            ["portfolio_risk"] = await CalculatePortfolioRiskFactorAsync(client),
            ["investment_duration"] = CalculateInvestmentDurationFactor(client),
            ["diversification"] = CalculateDiversificationFactor(client.Investimentos),
            ["market_exposure"] = CalculateMarketExposureFactor(client.Investimentos)
        };
    }

    private async Task<decimal> CalculatePortfolioRiskFactorAsync(Client client)
    {
        if (!client.Investimentos.Any()) return 0;

        decimal totalValue = 0;
        decimal weightedRisk = 0;

        foreach (var investment in client.Investimentos)
        {
            var investmentValue = investment.Quantidade * investment.Ativo.PrecoAtual;
            // Ativo.Risco is on 1-10 scale, normalize to 0-1
            var normalizedRisk = (investment.Ativo.Risco - 1) / 9m;
            var riskWeight = investmentValue * normalizedRisk;

            totalValue += investmentValue;
            weightedRisk += riskWeight;
        }

        return totalValue > 0 ? weightedRisk / totalValue : 0;
    }

    private decimal CalculateInvestmentDurationFactor(Client client)
    {
        // Calculate age from birth date
        var age = DateTime.Now.Year - client.DataNascimento.Year;
        if (DateTime.Now.DayOfYear < client.DataNascimento.DayOfYear)
            age--;

        // Younger investors tend to have higher risk tolerance
        return age switch
        {
            <= 25 => 0.8m,  // High risk tolerance
            <= 35 => 0.6m,  // Moderate-high risk tolerance
            <= 45 => 0.4m,  // Moderate risk tolerance
            <= 55 => 0.3m,  // Lower risk tolerance
            _ => 0.2m       // Conservative risk tolerance
        };
    }

    private decimal CalculateDiversificationFactor(IEnumerable<Investment> investments)
    {
        var investmentsList = investments.ToList();
        if (!investmentsList.Any()) return 1.0m;

        var assetTypes = investmentsList.Select(i => i.Ativo.Tipo).Distinct().Count();
        var totalInvestments = investmentsList.Count;

        // Calculate diversification score (0-1)
        var diversificationScore = Math.Min((decimal)assetTypes / 5m, 1.0m); // Assume 5 asset types is well diversified
        return 1.0m - (diversificationScore * 0.5m); // More diversification = lower risk factor
    }

    private decimal CalculateMarketExposureFactor(IEnumerable<Investment> investments)
    {
        var investmentsList = investments.ToList();
        if (!investmentsList.Any()) return 0;

        var totalValue = investmentsList.Sum(i => i.Quantidade * i.Ativo.PrecoAtual);
        if (totalValue == 0) return 0;

        // Calculate exposure to volatile markets (e.g., stocks, crypto)
        var volatileAssetsValue = investmentsList
            .Where(i => i.Ativo.Tipo == "Ação" || i.Ativo.Tipo == "Criptomoeda")
            .Sum(i => i.Quantidade * i.Ativo.PrecoAtual);

        return volatileAssetsValue / totalValue;
    }

    public async Task<CalculatedRiskHistory> SaveCalculatedRiskAsync(long clientId, int riskScore, Dictionary<string, decimal> factors)
    {
        var calculationData = new Dictionary<string, object>
        {
            ["timestamp"] = DateTime.UtcNow,
            ["factors"] = factors,
            ["algorithm_version"] = "1.0"
        };

        var historico = new CalculatedRiskHistory
        {
            ClienteId = (int)clientId,
            RiscoCalculado = riskScore,
            DadosCalculo = calculationData,
            DataCalculo = DateTime.UtcNow
        };

        await _clientRepository.AddCalculatedRiskAsync(historico);
        return historico;
    }

    public async Task<bool> IsRiskMismatchSignificantAsync(long clientId)
    {
        var investorProfile = await GetInvestorProfileAsync(clientId);
        var portfolioProfile = await GetPortfolioProfileAsync(clientId);

        var investorScore = ConvertProfileToRiskScore(investorProfile);
        var portfolioScore = ConvertProfileToRiskScore(portfolioProfile);

        if (investorScore == 0) return false;

        // Consider significant if difference is more than 2 points on 1-10 scale
        var difference = Math.Abs(portfolioScore - investorScore);
        return difference > 2;
    }

    public async Task<decimal> GetMismatchPercentageAsync(long clientId)
    {
        var investorProfile = await GetInvestorProfileAsync(clientId);
        var portfolioProfile = await GetPortfolioProfileAsync(clientId);

        var investorRiskScore = ConvertProfileToRiskScore(investorProfile);
        var portfolioRiskScore = ConvertProfileToRiskScore(portfolioProfile);

        if (investorRiskScore == 0) return 0;

        // Calculate percentage difference using 1-10 scale
        var difference = Math.Abs(portfolioRiskScore - investorRiskScore);
        var mismatchPercentage = (difference / 10m) * 100; // 10 is max scale

        return Math.Round(mismatchPercentage, 2);
    }

    public async Task<bool> IsClientMismatchedAsync(long clientId)
    {
        return await IsRiskMismatchSignificantAsync(clientId);
    }

    private string ConvertRiskScoreToProfile(int? riskScore)
    {
        return riskScore switch
        {
            null => "Indefinido",
            <= 3 => "Conservador",    // 1-3: Conservative
            <= 6 => "Moderado",       // 4-6: Moderate
            <= 8 => "Arrojado",       // 7-8: Aggressive
            _ => "Agressivo"          // 9-10: Very Aggressive
        };
    }

    private string ConvertPortfolioRiskToProfile(decimal portfolioRisk)
    {
        // portfolioRisk is in 0-1 range, convert to 1-10 scale for consistency
        var scaledRisk = (int)Math.Round(portfolioRisk * 9 + 1);
        return ConvertRiskScoreToProfile(scaledRisk);
    }

    private decimal ConvertProfileToRiskScore(string profile)
    {
        return profile switch
        {
            "Conservador" => 2,   // Represents scale 1-3
            "Moderado" => 5,      // Represents scale 4-6
            "Arrojado" => 7,      // Represents scale 7-8
            "Agressivo" => 9,     // Represents scale 9-10
            _ => 1
        };
    }

    public async Task<Dictionary<long, decimal>> GetMismatchPercentagesAsync(List<long> clientIds)
    {
        var result = new Dictionary<long, decimal>();
        foreach (var clientId in clientIds)
        {
            var percent = await GetMismatchPercentageAsync(clientId);
            result[clientId] = percent;
        }
        return result;
    }

    public async Task<Client> CreateProfile(Client client)
    {
        // Verifica duplicidade de email
        var existing = await _clientRepository.GetByEmailAsync(client.Email);
        if (existing != null)
            throw new Microsoft.EntityFrameworkCore.DbUpdateException("Email já cadastrado.");

        // Validação básica
        if (string.IsNullOrWhiteSpace(client.Nome))
            throw new System.ComponentModel.DataAnnotations.ValidationException("Nome é obrigatório.");
        if (string.IsNullOrWhiteSpace(client.Email))
            throw new System.ComponentModel.DataAnnotations.ValidationException("Email é obrigatório.");
        if (string.IsNullOrWhiteSpace(client.Cpf))
            throw new System.ComponentModel.DataAnnotations.ValidationException("CPF é obrigatório.");

        return await _clientRepository.AddAsync(client);
    }

    public async Task<Client> UpdateProfile(Client client)
    {
        // Validação básica
        if (string.IsNullOrWhiteSpace(client.Nome))
            throw new System.ComponentModel.DataAnnotations.ValidationException("Nome é obrigatório.");
        if (string.IsNullOrWhiteSpace(client.Email))
            throw new System.ComponentModel.DataAnnotations.ValidationException("Email é obrigatório.");
        if (string.IsNullOrWhiteSpace(client.Cpf))
            throw new System.ComponentModel.DataAnnotations.ValidationException("CPF é obrigatório.");

        await _clientRepository.UpdateAsync(client);
        return client;
    }
}
