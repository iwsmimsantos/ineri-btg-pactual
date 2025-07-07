using INERI.Backend.Models;
using INERI.Backend.Repositories;
using INERI.Backend.DTOs;

namespace INERI.Backend.Services;

public class AdvisorService
{
    private readonly IAdvisorRepository _advisorRepository;

    public AdvisorService(IAdvisorRepository advisorRepository)
    {
        _advisorRepository = advisorRepository;
    }

    public async Task<Advisor?> GetAdvisorByIdAsync(long advisorId)
    {
        return await _advisorRepository.GetAdvisorByIdAsync(advisorId);
    }

    public async Task<Advisor?> GetAdvisorWithClientsAsync(long advisorId)
    {
        return await _advisorRepository.GetWithClientsAsync(advisorId);
    }

    public async Task<AdvisorPreferencesDTO?> GetAdvisorPreferencesAsync(long advisorId)
    {
        var advisor = await _advisorRepository.GetByIdAsync(advisorId);
        if (advisor == null)
            return null;

        return new AdvisorPreferencesDTO
        {
            PreferenciaVolumeInvestido = advisor.PreferenciaVolumeInvestido,
            PreferenciaNivelDesenquadramento = advisor.PreferenciaNivelDesenquadramento,
            PreferenciaTempoSemContato = advisor.PreferenciaTempoSemContato
        };
    }

    public async Task<bool> UpdateAdvisorPreferencesAsync(long advisorId, AdvisorPreferencesDTO preferences)
    {
        var advisor = await _advisorRepository.GetByIdAsync(advisorId);
        if (advisor == null)
            return false;

        await _advisorRepository.UpdatePreferencesAsync(
            advisorId,
            preferences.PreferenciaVolumeInvestido,
            preferences.PreferenciaNivelDesenquadramento,
            preferences.PreferenciaTempoSemContato
        );

        return true;
    }
} 