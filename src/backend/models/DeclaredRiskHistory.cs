using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace INERI.Backend.Models;

[Table("historico_risco_declarado")]
public class DeclaredRiskHistory
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("cliente_id")]
    public int ClienteId { get; set; }

    [Column("risco_declarado")]
    public int RiscoDeclarado { get; set; }

    [Column("respostas_questionario", TypeName = "jsonb")]
    public string RespostasQuestionarioJson { get; set; } = "{}";

    [NotMapped]
    public Dictionary<string, object> RespostasQuestionario
    {
        get => JsonSerializer.Deserialize<Dictionary<string, object>>(RespostasQuestionarioJson) ?? new Dictionary<string, object>();
        set => RespostasQuestionarioJson = JsonSerializer.Serialize(value);
    }

    [Column("data_declaracao")]
    public DateTime DataDeclaracao { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("ClienteId")]
    public virtual Client Cliente { get; set; } = null!;
}
