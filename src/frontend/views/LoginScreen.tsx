import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../App';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';
import ButtonComponent from '../components/ButtonComponent';
import PasswordInputComponent from '../components/PasswordInputComponent';
import { useSignIn, useSignUp, useAuth } from '@clerk/clerk-expo';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { responsiveSize } = useResponsive();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const { isSignedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [currentSignUp, setCurrentSignUp] = useState<any>(null);
  const [isVerificationPrepared, setIsVerificationPrepared] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      navigation.replace('Main');
    }
  }, [isSignedIn, navigation]);

  const handleAuthentication = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (isSignUp && (!firstName.trim() || !lastName.trim())) {
      Alert.alert('Erro', 'Por favor, preencha seu nome completo.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        if (!isSignUpLoaded) {
          console.log('SignUp not loaded yet');
          return;
        }
        
        console.log('Attempting to sign up with:', { email, firstName, lastName });
        const result = await signUp.create({
          emailAddress: email,
          password,
          firstName,
          lastName,
        });

        console.log('SignUp result:', result);
        
        if (result.status === 'complete') {
          navigation.replace('Main');
        } else if (result.status === 'missing_requirements') {
          const missingFields = result.requiredFields || [];
          if (missingFields.includes('email_address')) {
            setCurrentSignUp(result);
            if (!isVerificationPrepared) {
              await result.prepareVerification({
                strategy: 'email_code'
              });
              setIsVerificationPrepared(true);
            }
            setNeedsVerification(true);
            Alert.alert(
              'Verificação Necessária',
              'Por favor, verifique seu email e insira o código de verificação.'
            );
          } else {
            const missingFieldsList = missingFields.join(', ');
            Alert.alert('Campos Obrigatórios', `Por favor, preencha os seguintes campos: ${missingFieldsList}`);
          }
        }
      } else {
        if (!isSignInLoaded) {
          console.log('SignIn not loaded yet');
          return;
        }

        if (isSignedIn) {
          console.log('User is already signed in');
          navigation.replace('Main');
          return;
        }

        console.log('Attempting to sign in with:', { email });
        const result = await signIn.create({
          identifier: email,
          password,
        });

        console.log('SignIn result:', result);
        if (result.status === 'complete') {
          navigation.replace('Main');
        } else {
          Alert.alert('Erro', 'Falha na autenticação. Verifique suas credenciais.');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      if (error instanceof Error && error.message.includes('already signed in')) {
        navigation.replace('Main');
      } else {
        Alert.alert(
          'Erro',
          isSignUp
            ? 'Não foi possível criar sua conta. Tente novamente.'
            : 'Não foi possível fazer login. Tente novamente.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Erro', 'Por favor, insira o código de verificação.');
      return;
    }

    setLoading(true);
    try {
      if (currentSignUp) {
        const result = await currentSignUp.attemptVerification({
          strategy: 'email_code',
          code: verificationCode
        });

        if (result.status === 'complete') {
          navigation.replace('Main');
        } else {
          Alert.alert('Erro', 'Código de verificação inválido. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Erro', 'Não foi possível verificar o código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu email para recuperar a senha.');
      return;
    }

    try {
      if (!isSignInLoaded) return;
      
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });

      Alert.alert(
        'Recuperar Senha',
        'Um email foi enviado com instruções para recuperar sua senha.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o email de recuperação.');
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setVerificationCode('');
    setNeedsVerification(false);
    setCurrentSignUp(null);
    setIsVerificationPrepared(false);
  };

  const handleBackToSignUp = () => {
    setNeedsVerification(false);
    setVerificationCode('');
    setIsVerificationPrepared(false);
  };

  if (!isSignInLoaded || !isSignUpLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.azul} />
      </View>
    );
  }

  if (needsVerification) {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={[styles.title, { fontSize: responsiveSize(20, 24, 28) }]}>
            Verificação de Email
          </Text>
          <Text style={[styles.subtitle, { fontSize: responsiveSize(14, 16, 18) }]}>
            Digite o código de verificação enviado para {email}
          </Text>

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, {
                fontSize: responsiveSize(14, 16, 18),
                height: responsiveSize(44, 48, 52),
              }]}
              placeholder="Código de verificação"
              placeholderTextColor={Colors.cinzaTexto}
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          <ButtonComponent
            title="Verificar"
            mode="escuro"
            size="large"
            fullWidth
            loading={loading}
            onPress={handleVerification}
            style={styles.loginButton}
          />

          <TouchableOpacity
            onPress={handleBackToSignUp}
            style={styles.toggleAuthContainer}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleAuthText, {
              fontSize: responsiveSize(12, 14, 16)
            }]}>
              Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Text style={[styles.logoText, { fontSize: responsiveSize(32, 40, 48) }]}>
            INERI
          </Text>
          <View style={[styles.logoAccent, {
            width: responsiveSize(8, 10, 12),
            height: responsiveSize(8, 10, 12),
            borderRadius: responsiveSize(4, 5, 6),
          }]} />
        </View>
      </View>

      <View style={styles.formContainer}>
        {isSignUp && (
          <>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, {
                fontSize: responsiveSize(14, 16, 18)
              }]}>Nome:</Text>
              <TextInput
                style={[styles.input, {
                  fontSize: responsiveSize(14, 16, 18),
                  height: responsiveSize(44, 48, 52),
                }]}
                placeholder="Digite seu nome"
                placeholderTextColor={Colors.cinzaTexto}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, {
                fontSize: responsiveSize(14, 16, 18)
              }]}>Sobrenome:</Text>
              <TextInput
                style={[styles.input, {
                  fontSize: responsiveSize(14, 16, 18),
                  height: responsiveSize(44, 48, 52),
                }]}
                placeholder="Digite seu sobrenome"
                placeholderTextColor={Colors.cinzaTexto}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>
          </>
        )}

        <View style={styles.inputGroup}>
          <Text style={[styles.label, {
            fontSize: responsiveSize(14, 16, 18)
          }]}>Email:</Text>
          <TextInput
            style={[styles.input, {
              fontSize: responsiveSize(14, 16, 18),
              height: responsiveSize(44, 48, 52),
            }]}
            placeholder="Digite seu email"
            placeholderTextColor={Colors.cinzaTexto}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>

        <PasswordInputComponent
          label="Senha:"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
        />

        <ButtonComponent
          title={isSignUp ? "Cadastrar" : "Entrar"}
          mode="escuro"
          size="large"
          fullWidth
          loading={loading}
          onPress={handleAuthentication}
          style={styles.loginButton}
        />

        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.forgotPasswordContainer}
          activeOpacity={0.7}
        >
          <Text style={[styles.forgotPasswordText, {
            fontSize: responsiveSize(12, 14, 16)
          }]}>
            Esqueceu sua senha
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleAuthMode}
          style={styles.toggleAuthContainer}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleAuthText, {
            fontSize: responsiveSize(12, 14, 16)
          }]}>
            {isSignUp ? "Já tem uma conta? Faça login" : "Não tem uma conta? Cadastre-se"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.branco,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.branco,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
    letterSpacing: 1,
  },
  logoAccent: {
    backgroundColor: Colors.azul,
    marginLeft: 6,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: Colors.azul,
    fontFamily: Fonts.semiBold,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.cinzaFundo,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: Fonts.regular,
    color: Colors.azul,
    borderWidth: 1,
    borderColor: Colors.cinzaContraste,
  },
  loginButton: {
    marginTop: 12,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: Colors.azul,
    fontFamily: Fonts.medium,
    textDecorationLine: 'underline',
  },
  toggleAuthContainer: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  toggleAuthText: {
    color: Colors.azul,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    marginTop: 16,
  },
  title: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginBottom: 24,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },
  showPasswordText: {
    color: Colors.azul,
    fontFamily: Fonts.medium,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
});
