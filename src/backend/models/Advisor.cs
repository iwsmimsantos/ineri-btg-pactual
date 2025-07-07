using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INERI.Backend.Models;

[Table("assessores")]
public class Advisor
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Column("categoria_assessor")]
    public CategoriaAssessor CategoriaAssessor { get; set; }

    [Column("data_criacao")]
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    [Column("ativo")]
    public bool Ativo { get; set; } = true;

    [Column("preferencia_volume_investido")]
    public int PreferenciaVolumeInvestido { get; set; } = 60;

    [Column("preferencia_nivel_desenquadramento")]
    public int PreferenciaNivelDesenquadramento { get; set; } = 60;

    [Column("preferencia_tempo_sem_contato")]
    public int PreferenciaTempoSemContato { get; set; } = 60;

    // Navigation properties
    public virtual ICollection<Client> Clientes { get; set; } = new List<Client>();
}
