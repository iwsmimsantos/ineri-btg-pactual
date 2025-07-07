using Microsoft.AspNetCore.Mvc;
using INERI.Backend.Services.Interfaces;
using INERI.Backend.DTOs;

namespace INERI.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly IRecommendationService _recommendationService;

    public RecommendationsController(IRecommendationService recommendationService)
    {
        _recommendationService = recommendationService;
    }

    [HttpGet("by-client/{clientId}")]
    public async Task<ActionResult<RecommendationResponse>> GetRecommendationsByClient(int clientId)
    {
        var recommendation = await _recommendationService.GetRecommendationFromApiAsync(clientId);
        if (recommendation == null)
            return NotFound();
        return Ok(recommendation);
    }
} 