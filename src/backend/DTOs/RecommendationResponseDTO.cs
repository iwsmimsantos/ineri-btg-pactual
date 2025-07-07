namespace INERI.Backend.DTOs;

public class RecommendationResponseDTO
{
    public int ClienteId { get; set; }
    public ProdutoDTO Produto { get; set; } = null!;
    public double PercentualRecomendado { get; set; }
    public string DataRecomendacao { get; set; } = string.Empty;

    public class ProdutoDTO
    {
        public string Nome { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public string Risco { get; set; } = string.Empty;
    }
} 