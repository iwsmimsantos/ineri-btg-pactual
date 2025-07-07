using Microsoft.AspNetCore.Mvc;
using INERI.Backend.Services;
using INERI.Backend.Models;
using INERI.Backend.DTOs;

namespace INERI.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdvisorsController : ControllerBase
{
    private readonly AdvisorService _advisorService;

    public AdvisorsController(AdvisorService advisorService)
    {
        _advisorService = advisorService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Advisor>> GetAdvisor(int id)
    {
        var advisor = await _advisorService.GetAdvisorByIdAsync(id);
        if (advisor == null)
            return NotFound();

        return Ok(advisor);
    }

    [HttpGet("{id}/preferences")]
    public async Task<ActionResult<AdvisorPreferencesDTO>> GetAdvisorPreferences(int id)
    {
        var preferences = await _advisorService.GetAdvisorPreferencesAsync(id);
        if (preferences == null)
            return NotFound();

        return Ok(preferences);
    }

    [HttpPut("{id}/preferences")]
    public async Task<IActionResult> UpdateAdvisorPreferences(int id, AdvisorPreferencesDTO preferences)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var success = await _advisorService.UpdateAdvisorPreferencesAsync(id, preferences);
        if (!success)
            return NotFound();

        return NoContent();
    }
} 