import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import HeaderBack from '../../components/HeaderBack';

// À remplacer par les vraies données de l'API
const mockEvents = [
  {
    id: '1',
    name: 'Festival de Jazz',
    date: '2024-03-15',
    location: 'Paris',
    status: 'confirmed',
  },
  {
    id: '2',
    name: 'Salon du Vin',
    date: '2024-04-20',
    location: 'Bordeaux',
    status: 'pending',
  },
];

const MyEventsScreen: React.FC = () => {
  const theme = useTheme<Theme>();

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
    eventCard: {
      backgroundColor: theme.colors.cardPrimary,
      margin: 10,
      padding: 15,
      borderRadius: 12,
    },
    eventName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    eventInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    eventText: {
      marginLeft: 8,
      color: theme.colors.textSecondary,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    statusText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
  });

  const renderEventCard = ({ item }: { item: typeof mockEvents[0] }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventName}>{item.name}</Text>
      
      <View style={styles.eventInfo}>
        <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
        <Text style={styles.eventText}>
          {new Date(item.date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.eventInfo}>
        <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
        <Text style={styles.eventText}>{item.location}</Text>
      </View>

      <View style={styles.statusContainer}>
        <View 
          style={[
            styles.statusDot,
            { 
              backgroundColor: item.status === 'confirmed' 
                ? theme.colors.success 
                : theme.colors.secondary 
            }
          ]} 
        />
        <Text style={styles.statusText}>
          {item.status === 'confirmed' ? 'Confirmé' : 'En attente'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderBack 
        title="Mes événements"
        subtitle="Événements où vous êtes restaurateur"
      />

      <FlatList
        data={mockEvents}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default MyEventsScreen; 