import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Text } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import HeaderBack from '../../components/HeaderBack';

const AccountSettingsScreen: React.FC = () => {
  const theme = useTheme<Theme>();
  const { user } = useAuth();

  // À remplacer par les vraies données et la gestion d'état avec le backend
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    restaurantName: '',
    cuisine: '',
    description: '',
    address: '',
    website: '',
    avatar: user?.avatar || null,
  });

  const sections = [
    {
      title: 'Informations personnelles',
      fields: [
        {
          id: 'firstName',
          label: 'Prénom',
          value: formData.firstName,
          icon: 'person-outline',
        },
        {
          id: 'lastName',
          label: 'Nom',
          value: formData.lastName,
          icon: 'person-outline',
        },
        {
          id: 'email',
          label: 'Email',
          value: formData.email,
          icon: 'mail-outline',
          keyboardType: 'email-address',
        },
        {
          id: 'phone',
          label: 'Téléphone',
          value: formData.phone,
          icon: 'call-outline',
          keyboardType: 'phone-pad',
        },
      ],
    },
    {
      title: 'Informations du restaurant',
      fields: [
        {
          id: 'restaurantName',
          label: 'Nom du restaurant',
          value: formData.restaurantName,
          icon: 'restaurant-outline',
        },
        {
          id: 'cuisine',
          label: 'Type de cuisine',
          value: formData.cuisine,
          icon: 'fast-food-outline',
        },
        {
          id: 'description',
          label: 'Description',
          value: formData.description,
          icon: 'document-text-outline',
          multiline: true,
        },
        {
          id: 'address',
          label: 'Adresse',
          value: formData.address,
          icon: 'location-outline',
        },
        {
          id: 'website',
          label: 'Site web',
          value: formData.website,
          icon: 'globe-outline',
          keyboardType: 'url',
        },
      ],
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: theme.colors.primary,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.white,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.white,
      opacity: 0.8,
    },
    avatarContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.cardPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    changeAvatarButton: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    changeAvatarText: {
      color: theme.colors.primary,
      marginLeft: 5,
      fontSize: 16,
    },
    content: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginTop: 20,
      marginBottom: 15,
    },
    inputContainer: {
      backgroundColor: theme.colors.cardPrimary,
      borderRadius: 12,
      marginBottom: 15,
      padding: 15,
    },
    label: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      padding: 0,
    },
    multilineInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 20,
      marginVertical: 20,
    },
    saveButtonText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = () => {
    // Implémenter la sauvegarde des données
    console.log('Saving data:', formData);
  };

  const handleChangeAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData(prev => ({
        ...prev,
        avatar: result.assets[0].uri,
      }));
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBack 
        title="Paramètres du compte"
        subtitle="Gérez vos informations personnelles et professionnelles"
      />

      <ScrollView style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {formData.avatar ? (
              <Image 
                source={{ uri: formData.avatar }} 
                style={styles.avatarImage}
              />
            ) : (
              <Ionicons 
                name="person" 
                size={60} 
                color={theme.colors.primary} 
              />
            )}
          </View>
          <TouchableOpacity 
            style={styles.changeAvatarButton}
            onPress={handleChangeAvatar}
          >
            <Ionicons 
              name="camera-outline" 
              size={20} 
              color={theme.colors.primary} 
            />
            <Text style={styles.changeAvatarText}>
              Changer la photo
            </Text>
          </TouchableOpacity>
        </View>

        {sections.map(section => (
          <View key={section.title}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.fields.map(field => (
              <View key={field.id} style={styles.inputContainer}>
                <Text style={styles.label}>{field.label}</Text>
                <View style={styles.inputRow}>
                  <Ionicons
                    name={field.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={theme.colors.textSecondary}
                    style={styles.icon}
                  />
                  <TextInput
                    value={field.value}
                    onChangeText={(value) => handleChange(field.id, value)}
                    style={[
                      styles.input,
                      field.multiline && styles.multilineInput,
                    ]}
                    placeholder={`Entrez votre ${field.label.toLowerCase()}`}
                    placeholderTextColor={theme.colors.textSecondary}
                    multiline={field.multiline}
                    numberOfLines={field.multiline ? 4 : 1}
                    keyboardType={field.keyboardType || 'default'}
                  />
                </View>
              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AccountSettingsScreen; 