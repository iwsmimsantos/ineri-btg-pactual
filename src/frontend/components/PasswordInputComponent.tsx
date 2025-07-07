import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';

interface PasswordInputComponentProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: any;
}

const PasswordInputComponent: React.FC<PasswordInputComponentProps> = ({
  label,
  placeholder = "Digite sua senha",
  value,
  onChangeText,
  error,
  style
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { responsiveSize } = useResponsive();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, {
          fontSize: responsiveSize(14, 16, 18)
        }]}>
          {label}
        </Text>
      )}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            styles.passwordInput,
            {
              fontSize: responsiveSize(14, 16, 18),
              height: responsiveSize(44, 48, 52),
            },
            error && styles.inputError
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.cinzaTexto}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.showPasswordButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={responsiveSize(20, 22, 24)}
            color={Colors.cinzaTexto}
          />
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={[styles.errorText, {
          fontSize: responsiveSize(12, 14, 16)
        }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: Colors.azul,
    fontFamily: Fonts.semiBold,
    marginBottom: 8,
  },
  passwordContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: Colors.cinzaFundo,
    borderWidth: 1,
    borderColor: Colors.cinzaContraste,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: Colors.azul,
    fontFamily: Fonts.regular,
  },
  passwordInput: {
    paddingRight: 50,
  },
  inputError: {
    borderColor: Colors.vermelho,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },
  errorText: {
    color: Colors.vermelho,
    fontFamily: Fonts.regular,
    marginTop: 4,
  },
});

export default PasswordInputComponent; 