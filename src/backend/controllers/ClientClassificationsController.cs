using Microsoft.AspNetCore.Mvc;
using INERI.Backend.Services;
using INERI.Backend.DTOs;

namespace INERI.Backend.Controllers;

[ApiController]
[Route("api/client-classifications")]
public class ClientClassificationsController : ControllerBase
{
    private readonly IClientClassificationService _classificationService;

    public ClientClassificationsController(IClientClassificationService classificationService)
    {
        _classificationService = classificationService;
    }

    [HttpGet("advisor/{advisorId}/summary")]
    public async Task<ActionResult<ClientClassificationSummaryDTO>> GetClassificationSummary(long advisorId)
    {
        try
        {
            var summary = await _classificationService.GetClientClassificationSummaryAsync(advisorId);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error getting client classifications", error = ex.Message });
        }
    }

    [HttpGet("random-clients")]
    public async Task<ActionResult<List<ClientResponseDTO>>> GetRandomClients([FromQuery] int limit = 10)
    {
        try
        {
            var clients = await _classificationService.GetRandomClientsFromAllAdvisorsAsync(limit);
            return Ok(clients);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error getting random clients", error = ex.Message });
        }
    }

    [HttpGet("advisor/{advisorId}/priority")]
    public async Task<ActionResult<List<ClientResponseDTO>>> GetPriorityClients(long advisorId, int page = 1, int pageSize = 5)
    {
        try
        {
            var clients = await _classificationService.GetPriorityClientsAsync(advisorId);
            var pagedClients = clients.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            return Ok(pagedClients);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error getting priority clients", error = ex.Message });
        }
    }

    [HttpGet("advisor/{advisorId}/high-investment")]
    public async Task<ActionResult<List<ClientResponseDTO>>> GetHighInvestmentClients(long advisorId, int page = 1, int pageSize = 5)
    {
        try
        {
            var clients = await _classificationService.GetHighInvestmentVolumeClientsAsync(advisorId);
            var pagedClients = clients.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            return Ok(pagedClients);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error getting high investment clients", error = ex.Message });
        }
    }

    [HttpGet("advisor/{advisorId}/critical-mismatch")]
    public async Task<ActionResult<List<ClientResponseDTO>>> GetCriticalMismatchClients(long advisorId, int page = 1, int pageSize = 5)
    {
        try
        {
            var clients = await _classificationService.GetCriticalMismatchClientsAsync(advisorId);
            var pagedClients = clients.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            return Ok(pagedClients);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error getting critical mismatch clients", error = ex.Message });
        }
    }

    [HttpGet("advisor/{advisorId}/high-exposure")]
    public async Task<ActionResult<List<ClientResponseDTO>>> GetHighExposureClients(long advisorId, int page = 1, int pageSize = 5)
    {
        try
        {
            var clients = await _classificationService.GetHighFinancialExposureClientsAsync(advisorId);
            var pagedClients = clients.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            return Ok(pagedClients);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error getting high exposure clients", error = ex.Message });
        }
    }
} 