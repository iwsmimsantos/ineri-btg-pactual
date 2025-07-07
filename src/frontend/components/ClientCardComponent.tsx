import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';

const { width: screenWidth } = Dimensions.get('window');

interface ClientCardComponentProps {
  clientName: string;
  profileType: string;
  portfolioType: string;
  percentage: number;
  initials?: string;
  onPress?: () => void;
}

const ClientCardComponent: React.FC<ClientCardComponentProps> = ({
  clientName,
  profileType,
  portfolioType,
  percentage,
  initials,
  onPress
}) => {
  // Generate initials from name if not provided
  const getInitials = (name: string): string => {
    if (initials) return initials;

    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Enhanced risk level determination
  const getRiskLevel = (value: number) => {
    if (value <= 10) {
      return {
        level: 'Baixo',
        background: '#e8f5e8', // Light green
        text: '#2e7d32',       // Dark green
        indicator: Colors.verde,
        priority: 'normal'
      };
    } else if (value <= 30) {
      return {
        level: 'Moderado',
        background: '#fff3e0', // Light orange
        text: '#ef6c00',       // Dark orange
        indicator: Colors.amarelo,
        priority: 'attention'
      };
    } else if (value <= 50) {
      return {
        level: 'Alto',
        background: '#fff8e1', // Light yellow
        text: Colors.amarelo,
        indicator: Colors.amarelo,
        priority: 'warning'
      };
    } else {
      return {
        level: 'Crítico',
        background: '#ffd2d8', // Light red
        text: Colors.vermelho,
        indicator: Colors.vermelho,
        priority: 'critical'
      };
    }
  };

  const riskInfo = getRiskLevel(percentage);

  // Determine if profiles are mismatched by text comparison
  const getProfileMismatch = () => {
    const investorProfile = profileType.replace('Perfil: ', '').toLowerCase();
    const portfolioProfile = portfolioType.replace('Perfil da Carteira: ', '').toLowerCase();

    return investorProfile !== portfolioProfile;
  };

  const isMismatched = getProfileMismatch();

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        riskInfo.priority === 'critical' && styles.criticalCard,
        riskInfo.priority === 'warning' && styles.warningCard
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.leftSection}>
        {/* Avatar with initials and risk indicator */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(clientName)}</Text>
          </View>
          {riskInfo.priority !== 'normal' && (
            <View style={[styles.riskIndicator, { backgroundColor: riskInfo.indicator }]} />
          )}
        </View>

        {/* Client information */}
        <View style={styles.clientInfo}>
          <Text style={styles.clientName} numberOfLines={2}>{clientName}</Text>
          <Text style={styles.profileText} numberOfLines={1}>{profileType}</Text>
          <Text style={[
            styles.portfolioText,
            isMismatched && styles.mismatchedText
          ]} numberOfLines={1}>
            {portfolioType}
          </Text>
        </View>
      </View>

      {/* Right section with enhanced risk display */}
      <View style={styles.rightSection}>
        <Text style={styles.percentageLabel}>Desenquadramento</Text>
        <View style={[
          styles.percentageContainer,
          { backgroundColor: riskInfo.background }
        ]}>
          <Text style={[
            styles.percentageValue,
            { color: riskInfo.text }
          ]}>{percentage}%</Text>
        </View>
        <Text style={[
          styles.riskLevel,
          { color: riskInfo.text }
        ]}>
          {riskInfo.level}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.branco,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.preto,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  criticalCard: {
    borderColor: Colors.vermelho,
    borderWidth: 2,
  },
  warningCard: {
    borderColor: Colors.amarelo,
    borderWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: screenWidth < 350 ? 50 : 60,
    height: screenWidth < 350 ? 50 : 60,
    borderRadius: screenWidth < 350 ? 25 : 30,
    backgroundColor: Colors.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.branco,
  },
  avatarText: {
    color: Colors.branco,
    fontSize: screenWidth < 350 ? 16 : 20,
    fontFamily: Fonts.bold,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: screenWidth < 350 ? 14 : 16,
    fontFamily: Fonts.bold,
    color: Colors.azul,
    marginBottom: 4,
  },
  profileText: {
    fontSize: screenWidth < 350 ? 12 : 14,
    color: Colors.cinzaTexto,
    marginBottom: 2,
    fontFamily: Fonts.regular,
  },
  portfolioText: {
    fontSize: screenWidth < 350 ? 12 : 14,
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
  },
  mismatchedText: {
    color: Colors.amarelo,
    fontFamily: Fonts.medium,
  },
  rightSection: {
    alignItems: 'center',
    minWidth: 80,
  },
  percentageLabel: {
    fontSize: 10,
    color: Colors.cinzaTexto,
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: Fonts.regular,
  },
  percentageContainer: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  percentageValue: {
    fontSize: screenWidth < 350 ? 16 : 18,
    fontFamily: Fonts.bold,
  },
  riskLevel: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
});

export default ClientCardComponent;
