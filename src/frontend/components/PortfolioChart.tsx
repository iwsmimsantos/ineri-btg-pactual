import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';

const { width: screenWidth } = Dimensions.get('window');

interface PortfolioItem {
  label: string;
  value: number;
  color: string;
}

interface PortfolioChartProps {
  portfolioData: PortfolioItem[];
}

// Valor default para testes e fallback
const defaultData: PortfolioItem[] = [
  { label: 'Renda Fixa', value: 40000, color: Colors.amarelo },
  { label: 'Ações', value: 30000, color: Colors.azulClaro },
  { label: 'FIIs', value: 20000, color: Colors.vermelho },
  { label: 'Fundos', value: 10000, color: Colors.azul },
];

const PortfolioChart: React.FC<PortfolioChartProps> = ({ portfolioData }) => {
  const [isPercentage, setIsPercentage] = useState(true);
  // Usa defaultData se portfolioData não for passado
  const data = portfolioData && portfolioData.length > 0 ? portfolioData : defaultData;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Responsive chart height based on screen size
  const chartHeight = Math.min(screenWidth * 0.5, 200);
  const maxBarHeight = chartHeight * 0.7;

  const chartData = data.map(item => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    return {
      ...item,
      displayValue: isPercentage
        ? `${percentage.toFixed(0)}%`
        : `R$ ${item.value.toLocaleString('pt-BR')}`,
      height: total > 0 ? (item.value / total) * maxBarHeight : 0,
    };
  });

  return (
    <View style={styles.container}>
      {/* Header com Toggle Switch */}
      <View style={styles.header}>
        <Text style={styles.title}>Composição da carteira</Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchOption,
              isPercentage && styles.activeOptionPercent,
            ]}
            onPress={() => setIsPercentage(true)}
          >
            <Text
              style={[
                styles.switchText,
                isPercentage && styles.activeTextPercent,
              ]}
            >
              %
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchOption,
              !isPercentage && styles.activeOptionCurrency,
            ]}
            onPress={() => setIsPercentage(false)}
          >
            <Text
              style={[
                styles.switchText,
                !isPercentage && styles.activeTextCurrency,
              ]}
            >
              R$
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Gráfico de Barras */}
      <View style={[styles.chartContainer, { height: chartHeight }]}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.barGroup}>
            <Text style={styles.barValue}>{item.displayValue}</Text>
            <View
              style={[
                styles.bar,
                {
                  height: item.height,
                  backgroundColor: item.color,
                },
              ]}
            />
            <Text style={styles.barLabel} numberOfLines={2}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.branco,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.azul,
    flex: 1,
    minWidth: 150,
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cinzaContraste,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 10,
  },
  switchOption: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 40,
    alignItems: 'center',
  },
  switchText: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  activeOptionPercent: {
    backgroundColor: Colors.azul,
  },
  activeTextPercent: {
    color: Colors.branco,
  },
  activeOptionCurrency: {
    backgroundColor: Colors.verde,
  },
  activeTextCurrency: {
    color: Colors.branco,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    backgroundColor: Colors.cinzaFundo,
    borderRadius: 12,
    paddingBottom: 10,
    paddingTop: 10,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
    maxWidth: screenWidth / 5,
  },
  bar: {
    width: '80%',
    maxWidth: 40,
    borderRadius: 6,
    minHeight: 20,
  },
  barValue: {
    fontSize: 11,
    marginBottom: 4,
    fontFamily: Fonts.bold,
    textAlign: 'center',
    color: Colors.azul,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: Fonts.regular,
    color: Colors.cinzaTexto,
  },
});

export default PortfolioChart;
