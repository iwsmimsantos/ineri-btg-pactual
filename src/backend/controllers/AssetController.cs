using Microsoft.AspNetCore.Mvc;
using INERI.Backend.Models;
using INERI.Backend.Services;
using System.Threading.Tasks;

namespace INERI.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetController : ControllerBase
    {
        private readonly IAssetService _service;

        public AssetController(IAssetService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssetsListAsync()
        {
            try
            {
                var assets = await _service.GetAssetsListAsync();
                return Ok(assets);
            }
            catch
            {
                return StatusCode(500, "Erro interno ao obter a lista de ativos.");
            }
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetAssetCategoriesAsync()
        {
            try
            {
                var categories = await _service.GetAssetCategoriesAsync();
                return Ok(categories);
            }
            catch
            {
                return StatusCode(500, "Erro interno ao obter as categorias de ativos.");
            }
        }

        [HttpGet("client/{clientId:int}")]
        public async Task<IActionResult> GetAssetsByClientAsync(int clientId)
        {
            if (clientId <= 0)
            {
                return BadRequest("O clientId deve ser um número inteiro positivo.");
            }

            try
            {
                var clientAssets = await _service.GetAssetsByClientAsync(clientId);
                if (clientAssets == null || clientAssets.Count == 0)
                    return NotFound($"Nenhum ativo encontrado para o cliente com ID {clientId}.");

                return Ok(clientAssets);
            }
            catch
            {
                return StatusCode(500, "Erro interno ao obter os ativos do cliente.");
            }
        }
    }
}
