import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

type EventsListScreenProps = {
  navigation: NativeStackNavigationProp<EventsStackParamList, 'EventsList'>;
};

const EventsListScreen: React.FC<EventsListScreenProps> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Données de démonstration
  const events = [
    {
      id: '1',
      name: 'Festival d\'été 2024',
      date: '15 Juin 2024',
      location: 'Paris',
      image: 'https://example.com/event1.jpg',
      price: '30.00',
      attendees: '1.2k',
      status: 'upcoming',
      description: 'Le plus grand festival de l\'été avec des artistes internationaux.',
      category: 'music',
    },
    {
      id: '2',
      name: 'Soirée Gastronomique',
      date: '22 Juin 2024',
      location: 'Lyon',
      image: 'https://example.com/event2.jpg',
      price: '75.00',
      attendees: '200',
      status: 'upcoming',
      description: 'Une soirée dédiée à la gastronomie française.',
      category: 'food',
    },
  ];

  const filters = [
    { id: 'all', label: 'Tous', icon: 'apps-outline' },
    { id: 'upcoming', label: 'À venir', icon: 'time-outline' },
    { id: 'ongoing', label: 'En cours', icon: 'play-outline' },
    { id: 'past', label: 'Passés', icon: 'checkmark-done-outline' },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simuler un chargement
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const renderEventCard = (event: any) => (
    <TouchableOpacity
      key={event.id}
      style={[styles.eventCard, { backgroundColor: theme.colors.background }]}
      onPress={() => handleEventPress(event.id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: event.image }}
        style={styles.eventImage}
        defaultSource={require('../../assets/logo.png')}
      />
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={[styles.eventName, { color: theme.colors.text }]} numberOfLines={1}>
            {event.name}
          </Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.eventInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              {event.date}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              {event.location}
            </Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.attendeesContainer}>
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              {event.price}€
            </Text>
            <View style={styles.attendees}>
              <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.attendeesText, { color: theme.colors.textSecondary }]}>
                {event.attendees}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.actionButtonText}>Se positionner</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* En-tête avec titre */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Événements
        </Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.inputBackground }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Rechercher un événement..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: theme.colors.inputBackground }]}
        >
          <Ionicons name="options-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filtres */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedFilter === filter.id
                    ? theme.colors.primary
                    : theme.colors.inputBackground,
              },
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Ionicons
              name={filter.icon as any}
              size={18}
              color={selectedFilter === filter.id ? '#FFF' : theme.colors.textSecondary}
              style={styles.filterIcon}
            />
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedFilter === filter.id
                      ? '#FFF'
                      : theme.colors.textSecondary,
                },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Liste des événements */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.eventsList}
        contentContainerStyle={styles.eventsContent}
      >
        {events.map(renderEventCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    maxHeight: 50,
    marginBottom: 15,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventsList: {
    flex: 1,
  },
  eventsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCard: {
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  eventContent: {
    padding: 15,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteButton: {
    padding: 5,
  },
  eventInfo: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    marginLeft: 5,
    fontSize: 14,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default EventsListScreen; 