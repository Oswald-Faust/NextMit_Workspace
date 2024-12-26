import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import CustomToast from '../../components/CustomToast';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

const API_URL = Platform.select({
  ios: __DEV__ ? 'http://localhost:5000/api/v1' : 'https://api.nextmit.com/api/v1',
  android: __DEV__ ? 'http://10.0.2.2:5000/api/v1' : 'https://api.nextmit.com/api/v1',
});

const RegisterScreen = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });

  const showToast = (message: string, type = 'error') => {
    setToast({ visible: true, message, type });
  };

  const handleRegister = async () => {
    // Validation du formulaire
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.password || !formData.confirmPassword) {
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
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password.trim(),
          phone: formData.phone.trim(),
          role: 'client' // On force le rôle client
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      await signUp(data.token);
      navigation.navigate('Main');

    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Contenu du formulaire */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  // ... autres styles
});

export default RegisterScreen;