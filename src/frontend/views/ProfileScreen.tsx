import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../App';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';
import PortfolioChart from '../components/PortfolioChart';
import ButtonComponent from '../components/ButtonComponent';
import LoadingComponent from '../components/LoadingComponent';
import ErrorComponent from '../components/ErrorComponent';
import ReportCard from '../components/ReportCard';
import { useProfileViewModel } from '../viewmodels/ProfileViewModel';

type ProfileScreenRouteProp = RouteProp<MainStackParamList, 'Profile'>;
type ProfileScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const route = useRoute<ProfileScreenRouteProp>();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { responsiveSize, isSmallScreen } = useResponsive();

  const clientId = route.params?.clientId || '1';

  // State for showing all assets or just top 5
  const [showAllAssets, setShowAllAssets] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const {
    clientInfo,
    clientProfileData,
    investmentData,
    portfolioData,
    loading,
    error,
    recommendationsLoading,
    recommendations,
    reportLoading: viewModelReportLoading,
    generatedReport,
    generateRecommendations,
    generateAIReport,
    downloadReport,
    openReport,
    clearReport,
    refreshClientData,
    clearError,
  } = useProfileViewModel(clientId);

  const handleGenerateRecommendations = async () => {
    const result = await generateRecommendations();

    if (result.success) {
      Alert.alert(
        'Sucesso',
        result.message,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  const handleGenerateAIReport = async () => {
    setReportLoading(true);
    try {
      const result = await generateAIReport(clientId);
      if (result.success) {
        Alert.alert(
          'Relatório Gerado',
          result.message,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Erro', result.message);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o relatório.');
    } finally {
      setReportLoading(false);
    }
  };

  const getDivergenceColor = (percentage: number) => {
    if (percentage <= 20) return Colors.verde;
    if (percentage <= 40) return Colors.amarelo;
    return Colors.vermelho;
  };

  const getVariationColor = (variation: number) => {
    if (variation > 0) return Colors.verde;
    if (variation < 0) return Colors.vermelho;
    return Colors.cinzaTexto;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Sort investments by total value (descending) and limit to top 5 if not showing all
  const sortedInvestments = [...investmentData].sort((a, b) => b.valorTotal - a.valorTotal);
  const displayedInvestments = showAllAssets ? sortedInvestments : sortedInvestments.slice(0, 5);
  const hasMoreAssets = sortedInvestments.length > 5;

  // Show loading state
  if (loading && !clientInfo) {
    return (
      <View style={styles.container}>
        <LoadingComponent message="Carregando dados do cliente..." />
      </View>
    );
  }

  // Show error state
  if (error && !clientInfo) {
    return (
      <View style={styles.container}>
        <ErrorComponent
          message={error}
          onRetry={() => {
            clearError();
            refreshClientData();
          }}
        />
      </View>
    );
  }

  // Show not found state
  if (!clientProfileData) {
    return (
      <View style={styles.container}>
        <ErrorComponent
          message="Dados do cliente não encontrados."
          onRetry={() => {
            clearError();
            refreshClientData();
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={[styles.profileHeader, { marginBottom: 8 }]}>
        <View style={[styles.avatar, {
          width: responsiveSize(60, 70, 80),
          height: responsiveSize(60, 70, 80),
          borderRadius: responsiveSize(30, 35, 40),
        }]}>
          <Text style={[styles.avatarText, {
            fontSize: responsiveSize(20, 24, 28)
          }]}>
            {clientProfileData.name ? clientProfileData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : ''}
          </Text>
        </View>
        <Text style={[styles.clientName, {
          fontSize: responsiveSize(22, 26, 30)
        }]}>{clientProfileData.name}</Text>
        <Text style={[styles.clientId, {
          fontSize: responsiveSize(14, 16, 18)
        }]}>ID: {clientProfileData.id}</Text>
        <View style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: responsiveSize(14, 16, 18), color: Colors.cinzaTexto }}>
            {clientProfileData.profileType}
          </Text>
          <Text style={{ fontSize: responsiveSize(14, 16, 18), color: Colors.cinzaTexto }}>
            {clientProfileData.portfolioType}
          </Text>
          <Text style={{ fontSize: responsiveSize(14, 16, 18), color: Colors.cinzaTexto }}>
            Grau de divergência: <Text style={{ color: getDivergenceColor(clientProfileData.percentage) }}>{clientProfileData.percentage}%</Text>
          </Text>
        </View>
      </View>

      {/* Portfolio Chart */}
      <View style={styles.chartSection}>
        <PortfolioChart portfolioData={portfolioData} />
      </View>

      {/* Assets Section */}
      <View style={styles.assetsSection}>
        <Text style={[styles.sectionTitle, {
          fontSize: responsiveSize(18, 20, 22)
        }]}>Ativos na Carteira</Text>

        <View style={styles.assetsList}>
          {displayedInvestments.map((inv) => {
            const totalCarteira = investmentData.reduce((sum, i) => sum + i.valorTotal, 0);
            const percentualCarteira = totalCarteira > 0 ? ((inv.valorTotal / totalCarteira) * 100).toFixed(2) : '--';

            return (
              <View key={inv.id} style={styles.assetItem}>
                <View style={styles.assetHeader}>
                  <View style={styles.assetInfo}>
                    <Text style={[styles.assetCode, {
                      fontSize: responsiveSize(16, 18, 20)
                    }]}>{inv.ativo.codigo}</Text>
                    <Text style={[styles.assetName, {
                      fontSize: responsiveSize(12, 14, 16)
                    }]}>{inv.ativo.nome}</Text>
                    <Text style={[styles.assetCategory, {
                      fontSize: responsiveSize(12, 13, 14)
                    }]}>{inv.ativo.tipo}</Text>
                  </View>
                  <View style={styles.assetValues}>
                    <Text style={[styles.assetTotal, {
                      fontSize: responsiveSize(16, 18, 20)
                    }]}>{formatCurrency(inv.valorTotal)}</Text>
                    <Text style={[styles.assetPercentage, {
                      fontSize: responsiveSize(12, 14, 16)
                    }]}>{percentualCarteira}% da carteira</Text>
                    <Text style={[
                      styles.assetVariation,
                      {
                        fontSize: responsiveSize(12, 13, 14),
                        color: getVariationColor(inv.ativo.rentabilidade || 0)
                      }
                    ]}>
                      {(inv.ativo.rentabilidade || 0) > 0 ? '+' : ''}{inv.ativo.rentabilidade || 0}%
                    </Text>
                  </View>
                </View>

                <View style={styles.assetDetails}>
                  <Text style={[styles.assetDetailText, {
                    fontSize: responsiveSize(11, 12, 13)
                  }]}>
                    {inv.quantidade} {inv.ativo.tipo === 'Ações' || inv.ativo.tipo === 'FIIs' || inv.ativo.tipo === 'Fundos' ? 'cotas' : 'títulos'} × {formatCurrency(inv.ativo.precoAtual)}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Show More/Show Less Button */}
          {hasMoreAssets && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowAllAssets(!showAllAssets)}
              activeOpacity={0.7}
            >
              <Text style={[styles.showMoreButtonText, {
                fontSize: responsiveSize(14, 16, 18)
              }]}>
                {showAllAssets ? 'Mostrar menos' : 'Mostrar todos'}
              </Text>
              <Ionicons
                name={showAllAssets ? "chevron-up" : "chevron-down"}
                size={responsiveSize(16, 18, 20)}
                color={Colors.azul}
                style={styles.showMoreIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Recommendations Section */}
      <View style={styles.recommendationsSection}>
        <Text style={[styles.sectionTitle, {
          fontSize: responsiveSize(18, 20, 22)
        }]}>Recomendações de Rebalanceamento</Text>

        {recommendationsLoading ? (
          <View style={styles.recommendationsLoading}>
            <LoadingComponent message="Gerando recomendações..." />
          </View>
        ) : recommendations ? (
          <View>
            {/* Portfolio Allocation Recommendations */}
            <View style={styles.allocationSection}>
              <Text style={[styles.subsectionTitle, {
                fontSize: responsiveSize(16, 18, 20)
              }]}>Alocação Recomendada</Text>

              <View style={styles.allocationGrid}>
                <View style={styles.allocationItem}>
                  <Text style={[styles.allocationLabel, {
                    fontSize: responsiveSize(12, 14, 16)
                  }]}>Renda Fixa</Text>
                  <Text style={[styles.allocationValue, {
                    fontSize: responsiveSize(16, 18, 20)
                  }]}>{(recommendations.propFixa * 100).toFixed(1)}%</Text>
                </View>

                <View style={styles.allocationItem}>
                  <Text style={[styles.allocationLabel, {
                    fontSize: responsiveSize(12, 14, 16)
                  }]}>Renda Variável</Text>
                  <Text style={[styles.allocationValue, {
                    fontSize: responsiveSize(16, 18, 20)
                  }]}>{(recommendations.propVariavel * 100).toFixed(1)}%</Text>
                </View>

                <View style={styles.allocationItem}>
                  <Text style={[styles.allocationLabel, {
                    fontSize: responsiveSize(12, 14, 16)
                  }]}>Outros</Text>
                  <Text style={[styles.allocationValue, {
                    fontSize: responsiveSize(16, 18, 20)
                  }]}>{(recommendations.propOutros * 100).toFixed(1)}%</Text>
                </View>
              </View>
            </View>

            {/* Recommended Assets */}
            <View style={styles.recommendedAssetsSection}>
              <Text style={[styles.subsectionTitle, {
                fontSize: responsiveSize(16, 18, 20)
              }]}>Ativos Recomendados</Text>

              {recommendations.ativosRecomendados.map((ativo, index) => (
                <View key={index} style={styles.recommendedAssetItem}>
                  <View style={styles.recommendedAssetInfo}>
                    <Text style={[styles.recommendedAssetName, {
                      fontSize: responsiveSize(14, 16, 18)
                    }]}>{ativo.nome}</Text>
                    <Text style={[styles.recommendedAssetScore, {
                      fontSize: responsiveSize(12, 14, 16)
                    }]}>Score: {ativo.score.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.scoreBar, {
                    width: `${Math.min(ativo.score * 100, 100)}%`
                  }]} />
                </View>
              ))}
            </View>

            {/* Adjustment Recommendation */}
            {recommendations.recomendacaoAjuste && (
              <View style={styles.adjustmentSection}>
                <Text style={[styles.subsectionTitle, {
                  fontSize: responsiveSize(16, 18, 20)
                }]}>Recomendação de Ajuste</Text>
                <Text style={[styles.adjustmentText, {
                  fontSize: responsiveSize(14, 16, 18)
                }]}>{recommendations.recomendacaoAjuste}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.noRecommendations}>
            <Ionicons
              name="analytics-outline"
              size={responsiveSize(48, 56, 64)}
              color={Colors.cinzaTexto}
              style={{ marginBottom: 16 }}
            />
            <Text style={[styles.noRecommendationsText, {
              fontSize: responsiveSize(14, 16, 18)
            }]}>
              Gere recomendações baseadas em IA para obter insights personalizados de rebalanceamento.
            </Text>
          </View>
        )}
      </View>

      {/* Generated Report Card */}
      {generatedReport && (
        <ReportCard
          report={generatedReport}
          onOpen={openReport}
          onDownload={downloadReport}
          onClose={clearReport}
        />
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {/* Recommendations Button */}
        <View style={styles.buttonContainer}>
          <ButtonComponent
            title={recommendations ? "Atualizar Recomendações" : "Gerar Recomendações"}
            mode="outline"
            size={isSmallScreen ? "medium" : "large"}
            fullWidth
            loading={recommendationsLoading}
            onPress={handleGenerateRecommendations}
          />
        </View>

        {/* AI Report Button */}
        <View style={styles.buttonContainer}>
          <ButtonComponent
            title="Gerar Relatório com IA"
            mode="escuro"
            size={isSmallScreen ? "medium" : "large"}
            fullWidth
            loading={reportLoading}
            onPress={handleGenerateAIReport}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cinzaFundo,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: Colors.branco,
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: Colors.azul,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: Colors.branco,
    fontFamily: Fonts.bold,
  },
  clientName: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  clientId: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
  },
  chartSection: {
    marginBottom: 20,
  },
  assetsSection: {
    backgroundColor: Colors.branco,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.preto,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
    marginBottom: 16,
  },
  assetsList: {
    marginTop: 8,
  },
  assetItem: {
    backgroundColor: Colors.cinzaContraste,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.azul,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  assetInfo: {
    flex: 1,
    marginRight: 16,
  },
  assetCode: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
    marginBottom: 2,
  },
  assetName: {
    color: Colors.azul,
    fontFamily: Fonts.regular,
    marginBottom: 4,
  },
  assetCategory: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.medium,
    backgroundColor: Colors.azul + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  assetValues: {
    alignItems: 'flex-end',
  },
  assetTotal: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
    marginBottom: 2,
  },
  assetPercentage: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
    marginBottom: 2,
  },
  assetVariation: {
    fontFamily: Fonts.semiBold,
  },
  assetDetails: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.cinzaTexto + '20',
  },
  assetDetailText: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  buttonContainer: {
    marginBottom: 12,
  },
  showMoreButton: {
    backgroundColor: Colors.cinzaContraste,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.azul,
  },
  showMoreButtonText: {
    color: Colors.azul,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  showMoreIcon: {
    marginLeft: 8,
  },
  recommendationsSection: {
    backgroundColor: Colors.branco,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.preto,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationsLoading: {
    paddingVertical: 40,
  },
  subsectionTitle: {
    color: Colors.azul,
    fontFamily: Fonts.semiBold,
    marginBottom: 12,
    marginTop: 16,
  },
  allocationSection: {
    marginBottom: 20,
  },
  allocationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  allocationItem: {
    backgroundColor: Colors.cinzaContraste,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  allocationLabel: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginBottom: 4,
  },
  allocationValue: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
    textAlign: 'center',
  },
  recommendedAssetsSection: {
    marginBottom: 20,
  },
  recommendedAssetItem: {
    backgroundColor: Colors.cinzaContraste,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  recommendedAssetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  recommendedAssetName: {
    color: Colors.azul,
    fontFamily: Fonts.semiBold,
    flex: 1,
  },
  recommendedAssetScore: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
  },
  scoreBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.azul + '20',
    borderRadius: 8,
  },
  adjustmentSection: {
    backgroundColor: Colors.cinzaContraste,
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.amarelo,
  },
  adjustmentText: {
    color: Colors.azul,
    fontFamily: Fonts.regular,
    lineHeight: 22,
  },
  noRecommendations: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noRecommendationsText: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginBottom: 16,
  },
});
