using System.ComponentModel.DataAnnotations;

namespace INERI.Backend.DTOs;

public class AdvisorPreferencesDTO
{
    [Range(0, 100)]
    public int PreferenciaVolumeInvestido { get; set; }

    [Range(0, 100)]
    public int PreferenciaNivelDesenquadramento { get; set; }

    [Range(0, 100)]
    public int PreferenciaTempoSemContato { get; set; }
} 