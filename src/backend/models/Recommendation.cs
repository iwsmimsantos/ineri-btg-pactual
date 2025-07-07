using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INERI.Backend.Models;

[Table("recomendacoes")]
public class Recommendation
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("cliente_id")]
    public int ClienteId { get; set; }

    [Column("ativo_id")]
    public int AtivoId { get; set; }

    [Required]
    [MaxLength(500)]
    [Column("descricao")]
    public string Descricao { get; set; } = string.Empty;

    [Column("quantidade_sugerida", TypeName = "decimal(18,6)")]
    public decimal QuantidadeSugerida { get; set; }

    [Column("status_recomendacao")]
    public StatusRecomendacao StatusRecomendacao { get; set; }

    [Column("data_criacao")]
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    [Column("data_atualizacao")]
    public DateTime? DataAtualizacao { get; set; }

    // Navigation properties
    [ForeignKey("ClienteId")]
    public virtual Client Cliente { get; set; } = null!;

    [ForeignKey("AtivoId")]
    public virtual Asset Ativo { get; set; } = null!;
}
