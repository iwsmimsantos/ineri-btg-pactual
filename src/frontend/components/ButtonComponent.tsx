import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';

interface ButtonComponentProps {
  title: string;
  onPress?: () => void;
  mode?: 'escuro' | 'claro' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  title,
  onPress = () => {},
  mode = 'escuro',
  disabled = false,
  loading = false,
  size = 'medium',
  fullWidth = false
}) => {
  const { responsiveSize } = useResponsive();

  const getButtonStyle = () => {
    const baseStyle = [styles.button];

    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.smallButton);
        break;
      case 'large':
        baseStyle.push(styles.largeButton);
        break;
      default:
        baseStyle.push(styles.mediumButton);
    }

    // Mode and state styles
    if (disabled || loading) {
      baseStyle.push(mode === 'escuro' ? styles.disabledDark : styles.disabledLight);
    } else {
      switch (mode) {
        case 'claro':
          baseStyle.push(styles.lightButton);
          break;
        case 'outline':
          baseStyle.push(styles.outlineButton);
          break;
        default:
          baseStyle.push(styles.darkButton);
      }
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];

    // Size text styles
    switch (size) {
      case 'small':
        baseStyle.push({ fontSize: responsiveSize(12, 14, 16) });
        break;
      case 'large':
        baseStyle.push({ fontSize: responsiveSize(16, 18, 20) });
        break;
      default:
        baseStyle.push({ fontSize: responsiveSize(14, 16, 18) });
    }

    // Mode and state text styles
    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    } else {
      switch (mode) {
        case 'claro':
        case 'outline':
          baseStyle.push(styles.lightButtonText);
          break;
        default:
          baseStyle.push(styles.darkButtonText);
      }
    }

    return baseStyle;
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          testID="ActivityIndicator"
          size="small"
          color={mode === 'escuro' ? Colors.branco : Colors.azul}
        />
      ) : (
      <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Better touch target for mobile
    shadowColor: Colors.preto,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidth: {
    width: '100%',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  darkButton: {
    backgroundColor: Colors.azul,
  },
  lightButton: {
    backgroundColor: Colors.branco,
    borderWidth: 2,
    borderColor: Colors.azul,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.azul,
  },
  buttonText: {
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
  darkButtonText: {
    color: Colors.branco,
  },
  lightButtonText: {
    color: Colors.azul,
  },
  disabledDark: {
    backgroundColor: Colors.cinzaBotoes,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledLight: {
    backgroundColor: Colors.branco,
    borderWidth: 2,
    borderColor: Colors.cinzaBotoes,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: Colors.cinzaTexto,
  }
});

export default ButtonComponent;
