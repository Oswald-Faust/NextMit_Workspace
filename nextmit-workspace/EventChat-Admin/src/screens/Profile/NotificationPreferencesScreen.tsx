import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Text } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import HeaderBack from '../../components/HeaderBack';

const NotificationPreferencesScreen: React.FC = () => {
  const theme = useTheme<Theme>();
  
  // À remplacer par un vrai état géré par le backend
  const [preferences, setPreferences] = useState({
    newEvents: true,
    eventUpdates: true,
    participationRequests: true,
    messages: true,
    marketing: false,
    emailNotifications: true,
    pushNotifications: true,
  });

  const notificationGroups = [
    {
      title: 'Événements',
      items: [
        {
          id: 'newEvents',
          label: 'Nouveaux événements',
          description: 'Soyez informé des nouveaux événements dans votre région',
        },
        {
          id: 'eventUpdates',
          label: 'Mises à jour des événements',
          description: 'Modifications et informations importantes sur vos événements',
        },
        {
          id: 'participationRequests',
          label: 'Demandes de participation',
          description: 'Statut de vos demandes de participation aux événements',
        },
      ],
    },
    {
      title: 'Communication',
      items: [
        {
          id: 'messages',
          label: 'Messages',
          description: 'Messages de l\'administration et des organisateurs',
        },
        {
          id: 'marketing',
          label: 'Offres et promotions',
          description: 'Informations sur les offres spéciales et nouveautés',
        },
      ],
    },
    {
      title: 'Méthodes de notification',
      items: [
        {
          id: 'emailNotifications',
          label: 'Notifications par email',
          description: 'Recevoir les notifications par email',
        },
        {
          id: 'pushNotifications',
          label: 'Notifications push',
          description: 'Recevoir les notifications sur votre appareil',
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
    content: {
      padding: 20,
    },
    groupTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginTop: 20,
      marginBottom: 15,
    },
    preferenceCard: {
      backgroundColor: theme.colors.cardPrimary,
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    preferenceInfo: {
      flex: 1,
      marginRight: 10,
    },
    preferenceLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 4,
    },
    preferenceDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  });

  const handleToggle = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof preferences],
    }));
  };

  return (
    <View style={styles.container}>
      <HeaderBack 
        title="Préférences de notifications"
        subtitle="Personnalisez vos notifications"
      />

      <ScrollView style={styles.content}>
        {notificationGroups.map(group => (
          <View key={group.title}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.items.map(item => (
              <View key={item.id} style={styles.preferenceCard}>
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceLabel}>{item.label}</Text>
                  <Text style={styles.preferenceDescription}>
                    {item.description}
                  </Text>
                </View>
                <Switch
                  value={preferences[item.id as keyof typeof preferences]}
                  onValueChange={() => handleToggle(item.id)}
                  trackColor={{ 
                    false: theme.colors.inputBackground, 
                    true: theme.colors.primary + '80'
                  }}
                  thumbColor={
                    preferences[item.id as keyof typeof preferences]
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NotificationPreferencesScreen; 