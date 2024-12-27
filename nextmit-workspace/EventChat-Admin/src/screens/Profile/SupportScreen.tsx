import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Text } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import HeaderBack from '../../components/HeaderBack';

const SupportScreen: React.FC = () => {
  const theme = useTheme<Theme>();

  const supportOptions = [
    {
      id: 'faq',
      title: 'Questions fréquentes',
      description: 'Trouvez rapidement des réponses à vos questions',
      icon: 'help-circle-outline',
      onPress: () => {
        // Implémenter la navigation vers la FAQ
      },
    },
    {
      id: 'chat',
      title: 'Chat en direct',
      description: 'Discutez avec notre équipe de support',
      icon: 'chatbubbles-outline',
      onPress: () => {
        // Implémenter l'ouverture du chat
      },
    },
    {
      id: 'email',
      title: 'Contactez-nous par email',
      description: 'Envoyez-nous un message détaillé',
      icon: 'mail-outline',
      onPress: () => {
        Linking.openURL('mailto:support@nextmit.com');
      },
    },
    {
      id: 'phone',
      title: 'Support téléphonique',
      description: 'Appelez-nous directement',
      icon: 'call-outline',
      onPress: () => {
        Linking.openURL('tel:+33123456789');
      },
    },
  ];

  const helpfulLinks = [
    {
      id: 'guide',
      title: 'Guide du restaurateur',
      description: 'Apprenez à utiliser toutes les fonctionnalités',
      icon: 'book-outline',
    },
    {
      id: 'terms',
      title: 'Conditions d\'utilisation',
      description: 'Consultez nos conditions d\'utilisation',
      icon: 'document-text-outline',
    },
    {
      id: 'privacy',
      title: 'Politique de confidentialité',
      description: 'Découvrez comment nous protégeons vos données',
      icon: 'shield-checkmark-outline',
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
    card: {
      backgroundColor: theme.colors.cardPrimary,
      borderRadius: 12,
      marginBottom: 15,
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 15,
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    cardDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    emergencyContainer: {
      backgroundColor: theme.colors.error + '20',
      borderRadius: 12,
      padding: 15,
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    emergencyIcon: {
      marginRight: 15,
    },
    emergencyContent: {
      flex: 1,
    },
    emergencyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.error,
      marginBottom: 4,
    },
    emergencyDescription: {
      fontSize: 14,
      color: theme.colors.error + '99',
    },
  });

  return (
    <View style={styles.container}>
      <HeaderBack 
        title="Aide et support"
        subtitle="Comment pouvons-nous vous aider ?"
      />

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Support</Text>
        {supportOptions.map(option => (
          <TouchableOpacity 
            key={option.id} 
            style={styles.card}
            onPress={option.onPress}
          >
            <View style={styles.iconContainer}>
              <Ionicons 
                name={option.icon as keyof typeof Ionicons.glyphMap} 
                size={24} 
                color={theme.colors.primary} 
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Ressources utiles</Text>
        {helpfulLinks.map(link => (
          <TouchableOpacity 
            key={link.id} 
            style={styles.card}
          >
            <View style={styles.iconContainer}>
              <Ionicons 
                name={link.icon as keyof typeof Ionicons.glyphMap} 
                size={24} 
                color={theme.colors.primary} 
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{link.title}</Text>
              <Text style={styles.cardDescription}>{link.description}</Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        ))}

        <View style={styles.emergencyContainer}>
          <Ionicons 
            name="alert-circle" 
            size={24} 
            color={theme.colors.error}
            style={styles.emergencyIcon}
          />
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>
              Besoin d'aide urgente ?
            </Text>
            <Text style={styles.emergencyDescription}>
              Notre équipe est disponible 24/7 pour les urgences
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SupportScreen; 