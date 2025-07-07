import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../App';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';
import ClientCardComponent from '../components/ClientCardComponent';
import SearchBarComponent from '../components/SearchBarComponent';
import LoadingComponent from '../components/LoadingComponent';
import ErrorComponent from '../components/ErrorComponent';
import { useClientsViewModel } from '../viewmodels/ClientsViewModel';
import { ClientCardData } from '../models/Client';

type NavigationProp = StackNavigationProp<MainStackParamList>;
type FilterType = 'todos' | 'desenquadrados' | 'novos';

export default function ClientsScreen() {
  const { responsiveSize, isSmallScreen } = useResponsive();
  const navigation = useNavigation<NavigationProp>();
  const {
    clients,
    loading,
    error,
    searchText,
    filterType,
    setSearchText,
    setFilterType,
    refreshClients,
    clearError,
    hasMore,
    loadMoreClients,
  } = useClientsViewModel();

  const filterTabs = [
    { id: 'todos' as FilterType, label: 'Todos' },
    { id: 'desenquadrados' as FilterType, label: 'Desenquadrados' },
    { id: 'novos' as FilterType, label: 'Novos' },
  ];

  const renderFilterTab = (tab: { id: FilterType; label: string }) => {
    const isActive = filterType === tab.id;
    return (
      <TouchableOpacity
        key={tab.id}
        style={[
          styles.filterTab,
          isActive && styles.activeFilterTab,
          isSmallScreen && styles.smallFilterTab
        ]}
        onPress={() => setFilterType(tab.id)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.filterTabText,
            isActive && styles.activeFilterTabText,
            { fontSize: responsiveSize(12, 14, 16) }
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderClientCard = ({ item }: { item: ClientCardData }) => (
    <ClientCardComponent
      clientName={item.name}
      profileType={item.profileType}
      portfolioType={item.portfolioType}
      percentage={item.percentage}
      onPress={() => navigation.navigate('Profile', { clientId: item.id })}
    />
  );

  // Show loading state
  if (loading && clients.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { fontSize: responsiveSize(24, 28, 32) }]}>
            Meus Clientes
          </Text>
        </View>
        <LoadingComponent message="Carregando clientes..." />
      </View>
    );
  }

  // Show error state
  if (error && clients.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { fontSize: responsiveSize(24, 28, 32) }]}>
            Meus Clientes
          </Text>
        </View>
        <ErrorComponent
          message={error}
          onRetry={() => {
            clearError();
            refreshClients();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: responsiveSize(24, 28, 32) }]}>
          Meus Clientes
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBarComponent
          placeholder="Buscar clientes..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContainer}
        >
          {filterTabs.map(renderFilterTab)}
        </ScrollView>
      </View>

      {/* Clients List */}
      <FlatList
        data={clients}
        renderItem={renderClientCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshClients}
            colors={[Colors.azul]}
            tintColor={Colors.azul}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={Colors.cinzaTexto} />
            <Text style={styles.emptyText}>
              {searchText.trim() ? 'Nenhum cliente encontrado' : 'Nenhum cliente na categoria selecionada'}
            </Text>
          </View>
        )}
        ListFooterComponent={hasMore && clients.length > 0 ? (
          <TouchableOpacity
            style={[styles.loadMoreButton, loading && styles.loadMoreButtonDisabled]}
            onPress={loadMoreClients}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.loadMoreButtonText}>{loading ? 'Carregando...' : 'Ver mais'}</Text>
          </TouchableOpacity>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cinzaFundo,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTabsContainer: {
    paddingHorizontal: 20,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.cinzaContraste,
    marginRight: 12,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallFilterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  activeFilterTab: {
    backgroundColor: Colors.azul,
  },
  filterTabText: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  activeFilterTabText: {
    color: Colors.branco,
    fontFamily: Fonts.semiBold,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  loadMoreButton: {
    marginVertical: 16,
    marginHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.azul,
    alignItems: 'center',
  },
  loadMoreButtonDisabled: {
    backgroundColor: Colors.cinzaContraste,
  },
  loadMoreButtonText: {
    color: Colors.branco,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
});
