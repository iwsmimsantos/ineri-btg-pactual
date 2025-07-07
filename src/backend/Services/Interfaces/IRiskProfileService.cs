using System.Collections.Generic;
using System.Threading.Tasks;
using INERI.Backend.Models;

namespace INERI.Backend.Services.Interfaces
{
    public interface IRiskProfileService
    {
        Task<string> GetInvestorProfileAsync(long clientId);
        Task<string> GetPortfolioProfileAsync(long clientId);
        Task<decimal> GetPortfolioRiskAsync(long clientId);
        Task<decimal> GetMismatchPercentageAsync(long clientId);
        Task<bool> IsClientMismatchedAsync(long clientId);
        Task<int> CalculateAdvancedRiskScoreAsync(long clientId);
        Task<CalculatedRiskHistory> SaveCalculatedRiskAsync(long clientId, int riskScore, Dictionary<string, decimal> factors);
        Task<bool> IsRiskMismatchSignificantAsync(long clientId);
        Task<Dictionary<string, decimal>> GetRiskFactorsAsync(long clientId);
        Task<Dictionary<long, decimal>> GetMismatchPercentagesAsync(List<long> clientIds);
        Task<Client> CreateProfile(Client client);
        Task<Client> UpdateProfile(Client client);
    }
} 