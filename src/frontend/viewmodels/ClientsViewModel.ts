import { useState, useEffect, useMemo, useCallback } from 'react';
import { ClientService } from '../services/ClientService';
import { ClientClassificationService } from '../services/ClientClassificationService';
import { ClientResponse, ClientCardData, ClientFilters } from '../models/Client';

export interface ClientsViewModelState {
  clients: ClientCardData[];
  filteredClients: ClientCardData[];
  loading: boolean;
  error: string | null;
  filters: ClientFilters;
}

export const useClientsViewModel = () => {
  const [state, setState] = useState<ClientsViewModelState>({
    clients: [],
    filteredClients: [],
    loading: false,
    error: null,
    filters: {
      searchText: '',
      filterType: 'todos',
    },
  });

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 20;

  const clientService = ClientService.getInstance();
  const classificationService = ClientClassificationService.getInstance();

  // Transform backend data to UI format
  const transformClientData = useCallback((backendClients: ClientResponse[]): ClientCardData[] => {
    return backendClients.map(client => {
      return {
        id: client.id.toString(),
        name: client.nome,
        profileType: `Perfil: ${client.perfilDeInvestidor}`,
        portfolioType: `Perfil da Carteira: ${client.perfilCarteira}`,
        percentage: Math.round(client.percentualDesenquadramento),
        status: client.isDesenquadrado ? 'desenquadrado' : 'normal',
      };
    });
  }, []);

  // Load clients from API (paginated) - AGORA USANDO CLIENTES DE TODOS OS ASSESSORES
  const loadClients = useCallback(async (nextPage = 1) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Usar o novo método que busca clientes aleatórios de todos os assessores
      const randomClients = await classificationService.getRandomClientsFromAllAdvisors(pageSize);
      const transformedClients = transformClientData(randomClients);
      
      // Para simular paginação, vamos usar um total fictício baseado no número de clientes retornados
      setTotalCount(randomClients.length * 10); // Simula que há mais páginas
      setHasMore(randomClients.length === pageSize); // Se retornou menos que pageSize, não há mais
      setPage(nextPage);
      setState(prev => ({
        ...prev,
        clients: nextPage === 1 ? transformedClients : [...prev.clients, ...transformedClients],
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load clients:', error);
      setState(prev => ({
        ...prev,
        error: 'Erro ao carregar clientes. Tente novamente.',
        loading: false,
      }));
    }
  }, [classificationService, transformClientData, pageSize]);

  // Função para carregar mais clientes
  const loadMoreClients = useCallback(() => {
    if (hasMore && !state.loading) {
      loadClients(page + 1);
    }
  }, [hasMore, state.loading, loadClients, page]);

  // Filter clients based on current filters
  const filteredClients = useMemo(() => {
    let filtered = state.clients;

    // Apply category filter
    switch (state.filters.filterType) {
      case 'desenquadrados':
        filtered = filtered.filter(client => client.status === 'desenquadrado');
        break;
      case 'novos':
        // For demo purposes, showing last 2 clients as "new"
        // In real implementation, you'd check client creation date
        filtered = filtered.slice(-2);
        break;
      default:
        // 'todos' - no additional filtering
        break;
    }

    // Apply search filter
    if (state.filters.searchText.trim()) {
      const searchTerm = state.filters.searchText.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }, [state.clients, state.filters]);

  // Update filtered clients when dependencies change
  useEffect(() => {
    setState(prev => ({ ...prev, filteredClients }));
  }, [filteredClients]);

  // Initialize data on mount
  useEffect(() => {
    loadClients(1);
  }, [loadClients]);

  // Actions
  const setSearchText = useCallback((searchText: string) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, searchText },
    }));
  }, []);

  const setFilterType = useCallback((filterType: ClientFilters['filterType']) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, filterType },
    }));
  }, []);

  const refreshClients = useCallback(() => {
    setPage(1);
    setHasMore(true);
    return loadClients(1);
  }, [loadClients]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    clients: state.filteredClients,
    loading: state.loading,
    error: state.error,
    searchText: state.filters.searchText,
    filterType: state.filters.filterType,
    hasMore,
    page,
    // Actions
    setSearchText,
    setFilterType,
    refreshClients,
    clearError,
    loadMoreClients,
  };
};
