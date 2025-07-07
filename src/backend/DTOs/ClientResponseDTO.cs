namespace INERI.Backend.DTOs;

public class ClientResponseDTO
{
    public long Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string PerfilDeInvestidor { get; set; } = string.Empty;
    public decimal Patrimonio { get; set; }
    public string PerfilCarteira { get; set; } = string.Empty;
    public int? RiscoDeclarado { get; set; }
    public int? RiscoCalculado { get; set; }
    public decimal RiscoCarteiraAtual { get; set; }
    public decimal PercentualDesenquadramento { get; set; }
    public bool IsDesenquadrado { get; set; }
    public DateTime? UltimaAtualizacaoRisco { get; set; }
    public decimal ScorePrioridade { get; set; }
}
