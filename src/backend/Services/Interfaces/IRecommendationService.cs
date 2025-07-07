using System.Collections.Generic;
using System.Threading.Tasks;
using INERI.Backend.DTOs;

namespace INERI.Backend.Services.Interfaces;

public interface IRecommendationService
{
    Task<IEnumerable<RecommendationResponseDTO>> GetRecommendationsByClientIdAsync(int clientId);
    Task<RecommendationResponse?> GetRecommendationFromApiAsync(int clientId);
} 