using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INERI.Backend.Models;

[Table("investimento")]
public class Investment
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("cliente_id")]
    public int ClienteId { get; set; }

    [Column("ativo_id")]
    public int AtivoId { get; set; }

    [Column("quantidade", TypeName = "decimal(18,6)")]
    public decimal Quantidade { get; set; }

    [Column("preco_compra", TypeName = "decimal(18,2)")]
    public decimal PrecoCompra { get; set; }

    [Column("data_compra")]
    public DateTime DataCompra { get; set; }

    [Column("data_criacao")]
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("ClienteId")]
    public virtual Client Cliente { get; set; } = null!;

    [ForeignKey("AtivoId")]
    public virtual Asset Ativo { get; set; } = null!;
}
