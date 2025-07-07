import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';

interface HeaderProps {
  onMenuPress: () => void;
}

const Header = ({ onMenuPress }: HeaderProps) => {
  const { responsiveSize } = useResponsive();

  return (
    <View style={styles.header}>
      {/* Text-based logo that works on all platforms */}
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, { fontSize: responsiveSize(20, 24, 28) }]}>
          INERI
        </Text>
        <View style={styles.logoAccent} />
      </View>

      <TouchableOpacity
        onPress={onMenuPress}
        style={styles.menuButton}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        <Ionicons
          name="menu"
          color={Colors.azul}
          size={responsiveSize(24, 26, 28)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: Colors.cinzaFundo,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cinzaContraste,
    shadowColor: Colors.preto,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
    letterSpacing: 1,
  },
  logoAccent: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.azul,
    marginLeft: 4,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
});

export default Header;
