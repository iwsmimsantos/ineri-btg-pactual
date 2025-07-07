using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INERI.Backend.Models;

[Table("ativos")]
public class Asset
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(10)]
    [Column("codigo")]
    public string Codigo { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    [Column("tipo")]
    public string Tipo { get; set; } = string.Empty;

    [Column("preco_atual", TypeName = "decimal(18,2)")]
    public decimal PrecoAtual { get; set; }

    [Column("risco", TypeName = "decimal(5,2)")]
    public decimal Risco { get; set; }

    [Column("rentabilidade", TypeName = "decimal(5,2)")]
    public decimal Rentabilidade { get; set; }

    [Column("data_criacao")]
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    [Column("ativo")]
    public bool Ativo_Status { get; set; } = true;

    // Navigation properties
    public virtual ICollection<Investment> Investimentos { get; set; } = new List<Investment>();
    public virtual ICollection<Recommendation> Recomendacoes { get; set; } = new List<Recommendation>();
}
