using Microsoft.AspNetCore.Mvc;
using INERI.API.Services;
using INERI.API.Models;

namespace INERI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly IDuckDBService _duckDBService;
    private readonly ILogger<RecommendationsController> _logger;

    public RecommendationsController(
        IDuckDBService duckDBService,
        ILogger<RecommendationsController> logger)
    {
        _duckDBService = duckDBService;
        _logger = logger;
    }

    [HttpGet("{conta}")]
    public async Task<ActionResult<RecommendationResponse>> GetRecommendations(int conta)
    {
        try
        {
            var recommendations = await _duckDBService.GetRecommendationsAsync(conta);
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter recomendações para a conta {Conta}", conta);
            
            if (ex.Message.StartsWith("A conta"))
            {
                return NotFound(new { error = ex.Message });
            }
            
            return StatusCode(500, new { error = "Erro interno ao processar a requisição" });
        }
    }
} 