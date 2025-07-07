using System.Collections.Generic;

namespace INERI.Backend.DTOs;

public class RecommendationResponse
{
    public double PropFixa { get; set; }
    public double PropVariavel { get; set; }
    public double PropOutros { get; set; }
    public double NivelDesenquadramento { get; set; }
    public List<AtivoRecomendado> AtivosRecomendados { get; set; } = new();
    public string RecomendacaoAjuste { get; set; } = string.Empty;
}

public class AtivoRecomendado
{
    public string Nome { get; set; } = string.Empty;
    public double Score { get; set; }
} 