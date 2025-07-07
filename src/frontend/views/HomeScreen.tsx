import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../App';
import { Colors } from '../theme/colors';
import { useResponsive } from '../hooks/useResponsive';
import { Fonts } from '../theme/fonts';
import { useUser } from '../hooks/useUser';

import PortfolioChart from '../components/PortfolioChart';
import ButtonComponent from '../components/ButtonComponent';
import CollapsibleClientListComponent from '../components/CollapsibleClientListComponent';
import ClientCardComponent from '../components/ClientCardComponent';
import LoadingComponent from '../components/LoadingComponent';
import ErrorComponent from '../components/ErrorComponent';
import { useHomeViewModel } from '../viewmodels/HomeViewModel';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { responsiveSize } = useResponsive();
    const { firstName, isAuthenticated } = useUser();

    // TODO: Get advisorId from auth context
    const advisorId = 1;
    
    const {
        priority,
        highInvestment,
        criticalMismatch,
        highExposure,
        loading,
        error,
        loadMorePriority,
        loadMoreHighInvestment,
        loadMoreCriticalMismatch,
        loadMoreHighExposure,
        refreshData,
        handleClientPress,
        clearError
    } = useHomeViewModel(advisorId, navigation);

    const handleNavigateToClients = () => {
        navigation.navigate('Clients');
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <LoadingComponent message="Carregando classificações..." />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <ErrorComponent 
                    message={error}
                    onRetry={refreshData}
                />
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container} 
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={refreshData}
                    colors={[Colors.azul]}
                />
            }
        >
            {/* Header Section */}
            <View style={styles.headerSection}>
                <Text style={styles.greeting}>
                    Olá, {isAuthenticated && firstName ? firstName : 'Usuário'}!
                </Text>
                <Text style={styles.subtitle}>
                    Acompanhe o status de perfil de investimento dos seus clientes.
                </Text>
            </View>

            {/* Priority Client Section */}
            {priority.clients.length > 0 && (
                <View style={styles.prioritySection}>
                    <Text style={styles.sectionTitle}>Cliente prioritário para hoje</Text>
                    <ClientCardComponent
                        clientName={priority.clients[0].name}
                        profileType={priority.clients[0].profileType}
                        portfolioType={priority.clients[0].portfolioType}
                        percentage={priority.clients[0].percentage}
                        onPress={() => handleClientPress(priority.clients[0].id)}
                    />
                </View>
            )}

            {/* Attention Clients Section */}
            <View style={styles.attentionSection}>
                <Text style={styles.sectionTitle}>Clientes que precisam de atenção</Text>

                <CollapsibleClientListComponent
                    title="Alto Investimento"
                    subtitle="Clientes com alto volume investido"
                    clients={highInvestment.clients}
                    icon="money"
                    onClientPress={handleClientPress}
                    onLoadMore={loadMoreHighInvestment}
                    hasMore={highInvestment.hasMore}
                />
                <CollapsibleClientListComponent
                    title="Desenquadramento Crítico"
                    subtitle="Clientes com desenquadramento crítico"
                    clients={criticalMismatch.clients}
                    icon="alert"
                    onClientPress={handleClientPress}
                    onLoadMore={loadMoreCriticalMismatch}
                    hasMore={criticalMismatch.hasMore}
                />
                <CollapsibleClientListComponent
                    title="Alta Exposição"
                    subtitle="Clientes com alta exposição financeira"
                    clients={highExposure.clients}
                    icon="exposure"
                    onClientPress={handleClientPress}
                    onLoadMore={loadMoreHighExposure}
                    hasMore={highExposure.hasMore}
                />
            </View>

            {/* View All Clients Button */}
            <View style={styles.buttonContainer}>
                <ButtonComponent
                    title="Visualizar lista completa de clientes"
                    mode="escuro"
                    size="large"
                    fullWidth
                    onPress={handleNavigateToClients}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cinzaFundo,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    color: Colors.azul,
    marginBottom: 8,
    fontFamily: Fonts.bold,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.cinzaTexto,
    lineHeight: 22,
    fontFamily: Fonts.regular,
  },
  prioritySection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.azul,
    marginBottom: 16,
    paddingHorizontal: 20,
    fontFamily: Fonts.semiBold,
  },
  attentionSection: {
    marginBottom: 32,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
});
