using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using INERI.Backend.Data;
using INERI.Backend.DTOs;
using INERI.Backend.Models;
using INERI.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Text.Json;

namespace INERI.Backend.Services;

public class RecommendationService : IRecommendationService
{
    private readonly InvestmentDbContext _context;

    public RecommendationService(InvestmentDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RecommendationResponseDTO>> GetRecommendationsByClientIdAsync(int clientId)
    {
        var recommendations = await _context.Recommendations
            .Include(r => r.Ativo)
            .Where(r => r.ClienteId == clientId)
            .ToListAsync();

        return recommendations.Select(r => new RecommendationResponseDTO
        {
            ClienteId = r.ClienteId,
            Produto = new RecommendationResponseDTO.ProdutoDTO
            {
                Nome = r.Ativo.Nome,
                Tipo = r.Ativo.Tipo,
                Risco = r.Ativo.Risco.ToString()
            },
            PercentualRecomendado = (double)r.QuantidadeSugerida,
            DataRecomendacao = r.DataCriacao.ToString("yyyy-MM-dd")
        });
    }

    public async Task<RecommendationResponse?> GetRecommendationFromApiAsync(int clientId)
    {
        using var httpClient = new HttpClient();
        var url = $"http://localhost:5555/api/recommendations/{clientId}";
        var response = await httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
            return null;

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<RecommendationResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }
} 