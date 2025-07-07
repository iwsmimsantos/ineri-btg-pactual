import { useState, useEffect, useCallback, useRef } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientClassificationService } from '../services/ClientClassificationService';
import { ClientClassificationSummary } from '../models/ClientClassification';
import { ClientCardData } from '../models/Client';
import { Config } from '../utils/config';
import { ClientResponse } from '../models/Client';
import { MainStackParamList } from '../App';

export interface HomeViewModelState {
    classificationSummary: ClientClassificationSummary | null;
    loading: boolean;
    error: string | null;
    retryCount: number;
    lastUpdated: number | null;
}

export interface CategoryPagination {
    clients: ClientCardData[];
    page: number;
    hasMore: boolean;
    loading: boolean;
}

export const useHomeViewModel = (advisorId: number, navigation?: StackNavigationProp<MainStackParamList>) => {
    const [state, setState] = useState<HomeViewModelState>({
        classificationSummary: null,
        loading: true,
        error: null,
        retryCount: 0,
        lastUpdated: null
    });

    const isLoadingRef = useRef(false);
    const classificationService = ClientClassificationService.getInstance();
    const [priority, setPriority] = useState<CategoryPagination>({ clients: [], page: 1, hasMore: true, loading: false });
    const [highInvestment, setHighInvestment] = useState<CategoryPagination>({ clients: [], page: 1, hasMore: true, loading: false });
    const [criticalMismatch, setCriticalMismatch] = useState<CategoryPagination>({ clients: [], page: 1, hasMore: true, loading: false });
    const [highExposure, setHighExposure] = useState<CategoryPagination>({ clients: [], page: 1, hasMore: true, loading: false });

    const PAGE_SIZE = 5;

    const loadClassificationSummary = useCallback(async (isRetry = false) => {
        if (isLoadingRef.current) return;

        // Check if data is still fresh (less than 1 minute old)
        const now = Date.now();
        if (state.lastUpdated && now - state.lastUpdated < Config.UI.REFRESH_INTERVAL) {
            return;
        }

        isLoadingRef.current = true;

        if (!isRetry) {
            setState(prev => ({ ...prev, loading: true, error: null }));
        }

        try {
            const summary = await classificationService.getClassificationSummary(advisorId);
            setState(prev => ({
                ...prev,
                classificationSummary: summary,
                loading: false,
                error: null,
                retryCount: 0,
                lastUpdated: now
            }));
        } catch (error) {
            console.error('Failed to load classification summary:', error);

            if (state.retryCount < Config.API.RETRY_ATTEMPTS) {
                setState(prev => ({
                    ...prev,
                    retryCount: prev.retryCount + 1
                }));

                const delay = Math.min(1000 * Math.pow(2, state.retryCount), 10000);
                setTimeout(() => loadClassificationSummary(true), delay);
                isLoadingRef.current = false;
                return;
            }

            setState(prev => ({
                ...prev,
                error: 'Erro ao carregar classificações. Tente novamente.',
                loading: false
            }));
        } finally {
            isLoadingRef.current = false;
        }
    }, [advisorId, state.retryCount, state.lastUpdated]);

    const refreshData = useCallback(() => {
        setState(prev => ({ ...prev, retryCount: 0, lastUpdated: null }));
        loadClassificationSummary();
    }, [loadClassificationSummary]);

    useEffect(() => {
        loadClassificationSummary();

        // Set up auto-refresh only if data is older than REFRESH_INTERVAL
        const intervalId = setInterval(() => {
            const now = Date.now();
            if (!state.lastUpdated || now - state.lastUpdated >= Config.UI.REFRESH_INTERVAL) {
                loadClassificationSummary();
            }
        }, Config.UI.REFRESH_INTERVAL);

        return () => clearInterval(intervalId);
    }, [loadClassificationSummary]);

    // Funções para carregar cada categoria
    const loadPriority = useCallback(async (nextPage = 1) => {
        setPriority(prev => ({ ...prev, loading: true }));
        try {
            const data = await classificationService.getPriorityClients(advisorId, nextPage, PAGE_SIZE);
            setPriority(prev => ({
                clients: nextPage === 1 ? data.map(toClientCardData) : [...prev.clients, ...data.map(toClientCardData)],
                page: nextPage,
                hasMore: data.length === PAGE_SIZE,
                loading: false
            }));
        } catch (e) {
            setPriority(prev => ({ ...prev, loading: false }));
        }
    }, [advisorId]);

    const loadHighInvestment = useCallback(async (nextPage = 1) => {
        setHighInvestment(prev => ({ ...prev, loading: true }));
        try {
            const data = await classificationService.getHighInvestmentClients(advisorId, nextPage, PAGE_SIZE);
            setHighInvestment(prev => ({
                clients: nextPage === 1 ? data.map(toClientCardData) : [...prev.clients, ...data.map(toClientCardData)],
                page: nextPage,
                hasMore: data.length === PAGE_SIZE,
                loading: false
            }));
        } catch (e) {
            setHighInvestment(prev => ({ ...prev, loading: false }));
        }
    }, [advisorId]);

    const loadCriticalMismatch = useCallback(async (nextPage = 1) => {
        setCriticalMismatch(prev => ({ ...prev, loading: true }));
        try {
            const data = await classificationService.getCriticalMismatchClients(advisorId, nextPage, PAGE_SIZE);
            setCriticalMismatch(prev => ({
                clients: nextPage === 1 ? data.map(toClientCardData) : [...prev.clients, ...data.map(toClientCardData)],
                page: nextPage,
                hasMore: data.length === PAGE_SIZE,
                loading: false
            }));
        } catch (e) {
            setCriticalMismatch(prev => ({ ...prev, loading: false }));
        }
    }, [advisorId]);

    const loadHighExposure = useCallback(async (nextPage = 1) => {
        setHighExposure(prev => ({ ...prev, loading: true }));
        try {
            const data = await classificationService.getHighExposureClients(advisorId, nextPage, PAGE_SIZE);
            setHighExposure(prev => ({
                clients: nextPage === 1 ? data.map(toClientCardData) : [...prev.clients, ...data.map(toClientCardData)],
                page: nextPage,
                hasMore: data.length === PAGE_SIZE,
                loading: false
            }));
        } catch (e) {
            setHighExposure(prev => ({ ...prev, loading: false }));
        }
    }, [advisorId]);

    // Carregar todas as categorias ao montar
    useEffect(() => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        Promise.allSettled([
            loadPriority(1),
            loadHighInvestment(1),
            loadCriticalMismatch(1),
            loadHighExposure(1)
        ]).then((results) => {
            // Se todas falharam, mostra erro
            const allRejected = results.every(r => r.status === 'rejected');
            if (allRejected) {
                setState(prev => ({ ...prev, error: 'Erro ao carregar dados. Tente novamente.', loading: false }));
            } else {
                setState(prev => ({ ...prev, loading: false }));
            }
        });
    }, [advisorId]);

    // Funções para ver mais
    const loadMorePriority = () => loadPriority(priority.page + 1);
    const loadMoreHighInvestment = () => loadHighInvestment(highInvestment.page + 1);
    const loadMoreCriticalMismatch = () => loadCriticalMismatch(criticalMismatch.page + 1);
    const loadMoreHighExposure = () => loadHighExposure(highExposure.page + 1);

    const handleClientPress = useCallback((clientId: string) => {
        if (navigation) {
            navigation.navigate('Profile', { clientId });
        } else {
            console.log('Client pressed:', clientId);
        }
    }, [navigation]);

    const clearError = useCallback(() => setState(prev => ({ ...prev, error: null })), []);

    return {
        // Cliente prioritário
        priority: {
            clients: state.classificationSummary?.priorityClient ? [state.classificationSummary.priorityClient] : [],
            count: state.classificationSummary?.priorityClient ? 1 : 0,
        },
        // Alto Investimento
        highInvestment: {
            clients: (state.classificationSummary?.classifications?.find(c => c.title.includes('Investimento'))?.clients || []).slice(0, 10),
            count: state.classificationSummary?.highInvestmentCount || 0,
        },
        // Desenquadramento Crítico
        criticalMismatch: {
            clients: (state.classificationSummary?.classifications?.find(c => c.title.includes('Desenquadramento'))?.clients || []).slice(0, 10),
            count: state.classificationSummary?.criticalMismatchCount || 0,
        },
        // Alta Exposição
        highExposure: {
            clients: (state.classificationSummary?.classifications?.find(c => c.title.includes('Exposição'))?.clients || []).slice(0, 10),
            count: state.classificationSummary?.highExposureCount || 0,
        },
        loading: state.loading,
        error: state.error,
        refreshData,
        handleClientPress,
        clearError
    };
};

// Função utilitária para transformar ClientResponse em ClientCardData
function toClientCardData(client: ClientResponse): ClientCardData {
    return {
        id: client.id.toString(),
        name: client.nome,
        profileType: `Perfil: ${client.perfilDeInvestidor}`,
        portfolioType: `Perfil da Carteira: ${client.perfilCarteira}`,
        percentage: Math.round(client.percentualDesenquadramento),
        status: client.isDesenquadrado ? 'desenquadrado' : 'normal',
    };
} 