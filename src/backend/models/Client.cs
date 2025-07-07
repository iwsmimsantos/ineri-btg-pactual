using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INERI.Backend.Models;

[Table("clientes")]
public class Client
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(14)]
    [Column("cpf")]
    public string Cpf { get; set; } = string.Empty;

    [Column("data_nascimento")]
    public DateTime DataNascimento { get; set; }

    [Column("assessor_id")]
    public long AssessorId { get; set; }

    [Column("data_criacao")]
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    [Column("ativo")]
    public bool Ativo { get; set; } = true;

    // Navigation properties
    [ForeignKey("AssessorId")]
    public virtual Advisor Assessor { get; set; } = null!;

    public virtual ICollection<Investment> Investimentos { get; set; } = new List<Investment>();
    public virtual ICollection<DeclaredRiskHistory> HistoricosRiscoDeclarado { get; set; } = new List<DeclaredRiskHistory>();
    public virtual ICollection<CalculatedRiskHistory> HistoricosRiscoCalculado { get; set; } = new List<CalculatedRiskHistory>();
    public virtual ICollection<Recommendation> Recomendacoes { get; set; } = new List<Recommendation>();
}
