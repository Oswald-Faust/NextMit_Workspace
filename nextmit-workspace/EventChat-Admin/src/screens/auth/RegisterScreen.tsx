import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
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


const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const { signUp, isAuthorized } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'error' as 'error' | 'success'
  });

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ visible: true, message, type });
  };

  const handleRegister = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      showToast('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.email.includes('@')) {
      showToast('Format d\'email invalide');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          role: 'manager',
          isVerified: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      if (data.user?.role !== 'manager') {
        throw new Error('Erreur lors de la création du compte manager. Veuillez contacter l\'administrateur.');
      }

      await signUp(data.token, data.user);
      showToast('Compte manager créé avec succès !', 'success');

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

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Inscription Manager
        </Text>

        <View style={styles.nameContainer}>
          <TextInput
            style={[
              styles.input,
              { width: '48%', backgroundColor: theme.colors.inputBackground }
            ]}
            placeholder="Prénom"
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          />
          <TextInput
            style={[
              styles.input,
              { width: '48%', backgroundColor: theme.colors.inputBackground }
            ]}
            placeholder="Nom"
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          />
        </View>

        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.inputBackground }]}
          placeholder="Email"
          placeholderTextColor={theme.colors.textSecondary}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.inputBackground }]}
            placeholder="Mot de passe"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry={!formData.showPassword}
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
          >
            <Ionicons 
              name={formData.showPassword ? "eye-off" : "eye"} 
              size={24} 
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.inputBackground }]}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry={!formData.showConfirmPassword}
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setFormData({ ...formData, showConfirmPassword: !formData.showConfirmPassword })}
          >
            <Ionicons 
              name={formData.showConfirmPassword ? "eye-off" : "eye"} 
              size={24} 
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.registerButton}
          onPress={handleRegister}
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
              <Text style={[styles.registerButtonText, { color: theme.colors.text }]}>
                S'inscrire
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.loginLinkText, { color: theme.colors.textSecondary }]}>
            Déjà un compte ? Connectez-vous
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 12,
  },
  registerButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
  },
});

export default RegisterScreen;