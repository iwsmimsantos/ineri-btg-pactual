import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';

interface ErrorComponentProps {
  message: string;
  onRetry?: () => void;
  retryButtonText?: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  message,
  onRetry,
  retryButtonText = 'Tentar novamente',
}) => {
  const { responsiveSize } = useResponsive();

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color={Colors.vermelho} />
      <Text style={[styles.message, { fontSize: responsiveSize(14, 16, 18) }]}>
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Text style={[styles.retryButtonText, { fontSize: responsiveSize(14, 16, 18) }]}>
            {retryButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  message: {
    marginTop: 16,
    marginBottom: 24,
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: Colors.azul,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.branco,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
});

export default ErrorComponent;
