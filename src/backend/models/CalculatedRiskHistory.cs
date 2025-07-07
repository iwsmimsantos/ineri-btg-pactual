using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace INERI.Backend.Models;

[Table("historico_risco_calculado")]
public class CalculatedRiskHistory
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("cliente_id")]
    public int ClienteId { get; set; }

    [Column("risco_calculado")]
    public int RiscoCalculado { get; set; }

    [Column("dados_calculo", TypeName = "jsonb")]
    public string DadosCalculoJson { get; set; } = "{}";

    [NotMapped]
    public Dictionary<string, object> DadosCalculo
    {
        get => JsonSerializer.Deserialize<Dictionary<string, object>>(DadosCalculoJson) ?? new Dictionary<string, object>();
        set => DadosCalculoJson = JsonSerializer.Serialize(value);
    }

    [Column("data_calculo")]
    public DateTime DataCalculo { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("ClienteId")]
    public virtual Client Cliente { get; set; } = null!;
}
