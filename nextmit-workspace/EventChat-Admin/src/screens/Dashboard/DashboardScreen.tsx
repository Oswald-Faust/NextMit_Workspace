import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.45;

const DashboardScreen = () => {
  const theme = useTheme<Theme>();
  const { user } = useAuth();

  const StatCard = ({ title, value, icon, color }: any) => (
    <LinearGradient
      colors={[color, color + '99']}
      style={styles.statCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.statIconContainer}>
        <Ionicons name={icon} size={24} color="#FFF" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </LinearGradient>
  );

  const EventCard = ({ event }: any) => (
    <TouchableOpacity style={[styles.eventCard, { backgroundColor: theme.colors.inputBackground }]}>
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={[styles.eventName, { color: theme.colors.text }]} numberOfLines={1}>
          {event.name}
        </Text>
        <Text style={[styles.eventDate, { color: theme.colors.textSecondary }]}>
          {event.date}
        </Text>
        <View style={styles.eventStats}>
          <View style={styles.eventStat}>
            <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.eventStatText, { color: theme.colors.textSecondary }]}>
              {event.attendees}
            </Text>
          </View>
          <View style={styles.eventStat}>
            <Ionicons name="cart-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.eventStatText, { color: theme.colors.textSecondary }]}>
              {event.orders}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Données de démonstration
  const stats = [
    { title: 'Événements', value: '12', icon: 'calendar', color: '#FF6B6B' },
    { title: 'Commandes', value: '48', icon: 'cart', color: '#4ECDC4' },
    { title: 'Revenus', value: '2.4k€', icon: 'cash', color: '#45B7D1' },
    { title: 'Publicités', value: '8', icon: 'megaphone', color: '#96C93D' },
  ];

  const upcomingEvents = [
    {
      id: 1,
      name: 'Festival d\'été 2024',
      date: '15 Juin 2024',
      image: 'https://example.com/event1.jpg',
      attendees: '1.2k',
      orders: '156',
    },
    {
      id: 2,
      name: 'Concert Rock',
      date: '22 Juin 2024',
      image: 'https://example.com/event2.jpg',
      attendees: '800',
      orders: '89',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* En-tête */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>
            Bienvenue,
          </Text>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </View>

      {/* Événements à venir */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Événements à venir
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllButton, { color: theme.colors.primary }]}>
              Voir tout
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventsScroll}>
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ScrollView>
      </View>

      {/* Actions rapides */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Actions rapides
        </Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: theme.colors.inputBackground }]}
          >
            <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
              Nouvelle commande
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: theme.colors.inputBackground }]}
          >
            <Ionicons name="megaphone-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
              Créer une pub
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllButton: {
    fontSize: 14,
  },
  eventsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  eventCard: {
    width: cardWidth,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventInfo: {
    padding: 12,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    marginBottom: 8,
  },
  eventStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventStatText: {
    fontSize: 12,
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default DashboardScreen; 