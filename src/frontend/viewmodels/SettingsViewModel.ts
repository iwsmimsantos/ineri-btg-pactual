import { useState, useCallback, useEffect } from 'react';
import { AdvisorService, AdvisorPreferences } from '../services/AdvisorService';

interface SettingsViewModelState {
    preferences: AdvisorPreferences;
    loading: boolean;
    error: string | null;
}

export const useSettingsViewModel = (advisorId: number) => {
    const [state, setState] = useState<SettingsViewModelState>({
        preferences: {
            preferenciaVolumeInvestido: 60,
            preferenciaNivelDesenquadramento: 60,
            preferenciaTempoSemContato: 60
        },
        loading: false,
        error: null
    });

    const advisorService = AdvisorService.getInstance();

    const loadPreferences = useCallback(async () => {
        console.log('Loading preferences for advisor:', advisorId);
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const preferences = await advisorService.getPreferences(advisorId);
            console.log('Loaded preferences:', preferences);

            setState(prev => ({
                ...prev,
                preferences,
                loading: false
            }));
        } catch (error) {
            console.error('Failed to load preferences:', error);
            setState(prev => ({
                ...prev,
                error: 'Erro ao carregar preferências. Tente novamente.',
                loading: false
            }));
        }
    }, [advisorId]);

    const updatePreferences = useCallback(async (newPreferences: AdvisorPreferences) => {
        console.log('Updating preferences for advisor:', advisorId, 'with data:', newPreferences);
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            await advisorService.updatePreferences(advisorId, newPreferences);
            console.log('Preferences updated successfully');

            setState(prev => ({
                ...prev,
                preferences: newPreferences,
                loading: false
            }));
            return true;
        } catch (error) {
            console.error('Failed to update preferences:', error);
            setState(prev => ({
                ...prev,
                error: 'Erro ao salvar preferências. Tente novamente.',
                loading: false
            }));
            return false;
        }
    }, [advisorId]);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // Load preferences when component mounts
    useEffect(() => {
        loadPreferences();
    }, [loadPreferences]);

    return {
        preferences: state.preferences,
        loading: state.loading,
        error: state.error,
        loadPreferences,
        updatePreferences,
        clearError
    };
}; 