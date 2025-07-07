import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';

interface LoadingComponentProps {
  message?: string;
  size?: 'small' | 'large';
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  message = 'Carregando...',
  size = 'large',
}) => {
  const { responsiveSize } = useResponsive();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors.azul} />
      <Text style={[styles.message, { fontSize: responsiveSize(14, 16, 18) }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  message: {
    marginTop: 16,
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
});

export default LoadingComponent;
