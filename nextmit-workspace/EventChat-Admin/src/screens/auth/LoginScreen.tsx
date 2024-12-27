import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
  ActivityIndicator,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@shopify/restyle';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import CustomToast from '../../components/CustomToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const API_URL = Platform.select({
  android: __DEV__ 
    ? 'http://192.168.8.197:5000/api/v1'  // Votre IP Wi-Fi
    : 'http://localhost:5000/api/v1',
  ios: __DEV__
    ? 'http://192.168.8.197:5000/api/v1'  // Même IP
    : 'http://localhost:5000/api/v1',
  default: 'http://localhost:5000/api/v1'
});

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const { signIn, isAuthorized } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'error' as 'error' | 'success'
  });

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ visible: true, message, type });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('Pas de connexion Internet');
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      if (data.user?.role !== 'manager') {
        throw new Error('Accès non autorisé. Seuls les managers peuvent se connecter à cette application.');
      }

      await signIn(data.token, data.user);
      showToast('Connexion réussie !', 'success');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });

    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomToast 
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />

      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[styles.title, { color: theme.colors.text }]}>
        Administration EventChat
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.inputBackground }]}
          placeholder="Email"
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.inputBackground }]}
            placeholder="Mot de passe"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={24} 
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <Text style={[styles.loginText, { color: theme.colors.text }]}>
              Connexion
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={[styles.registerText, { color: theme.colors.textSecondary }]}>
          Pas encore de compte ? Inscrivez-vous
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 12,
  },
  loginButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
});

export default LoginScreen;