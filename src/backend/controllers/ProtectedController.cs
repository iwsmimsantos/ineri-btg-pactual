using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace INERI.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProtectedController : ControllerBase
{
    [HttpGet]
    [Authorize]
    public IActionResult GetProtectedData()
    {
        var userId = User.FindFirst("sub")?.Value;
        return Ok(new { message = "This is protected data", userId });
    }
} 