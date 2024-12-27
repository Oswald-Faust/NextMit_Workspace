import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdvertisingStackParamList } from '../../navigation/types';

type SelectEventScreenProps = {
  navigation: NativeStackNavigationProp<AdvertisingStackParamList, 'SelectEvent'>;
};

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  image: string;
  attendees: string;
  category: string;
}

const SelectEventScreen: React.FC<SelectEventScreenProps> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Données de démonstration
  const events: Event[] = [
    {
      id: '1',
      name: 'Festival d\'été 2024',
      date: '15-17 Juin 2024',
      location: 'Parc des Expositions, Paris',
      image: 'https://example.com/event1.jpg',
      attendees: '1.2k',
      category: 'music',
    },
    {
      id: '2',
      name: 'Soirée Gastronomique',
      date: '22 Juin 2024',
      location: 'Grand Palais, Lyon',
      image: 'https://example.com/event2.jpg',
      attendees: '500',
      category: 'food',
    },
  ];

  const categories = [
    { id: 'all', label: 'Tous', icon: 'apps-outline' },
    { id: 'music', label: 'Musique', icon: 'musical-notes-outline' },
    { id: 'food', label: 'Gastronomie', icon: 'restaurant-outline' },
    { id: 'sport', label: 'Sport', icon: 'basketball-outline' },
    { id: 'art', label: 'Art', icon: 'color-palette-outline' },
  ];

  const handleEventSelect = (event: Event) => {
    // TODO: Implémenter la logique de sélection
    navigation.goBack();
  };

  const renderEventCard = (event: Event) => (
    <TouchableOpacity
      key={event.id}
      style={[styles.eventCard, { backgroundColor: theme.colors.background }]}
      onPress={() => handleEventSelect(event)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: event.image }}
        style={styles.eventImage}
        defaultSource={require('../../assets/logo.png')}
      />
      <View style={styles.eventContent}>
        <Text style={[styles.eventName, { color: theme.colors.text }]} numberOfLines={1}>
          {event.name}
        </Text>
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
          <View style={styles.attendees}>
            <Ionicons name="people-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.attendeesText, { color: theme.colors.primary }]}>
              {event.attendees} participants
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.selectButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleEventSelect(event)}
          >
            <Text style={styles.selectButtonText}>Sélectionner</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Sélectionner un événement
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
      </View>

      {/* Catégories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  selectedCategory === category.id
                    ? theme.colors.primary
                    : theme.colors.inputBackground,
              },
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={18}
              color={selectedCategory === category.id ? '#FFF' : theme.colors.textSecondary}
              style={styles.categoryIcon}
            />
            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    selectedCategory === category.id
                      ? '#FFF'
                      : theme.colors.textSecondary,
                },
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Liste des événements */}
      <ScrollView
        showsVerticalScrollIndicator={false}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 22.5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    maxHeight: 50,
    marginBottom: 15,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventsList: {
    flex: 1,
  },
  eventsContent: {
    padding: 20,
  },
  eventCard: {
    flexDirection: 'row',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
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
    width: 100,
    height: '100%',
  },
  eventContent: {
    flex: 1,
    padding: 15,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventInfo: {
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  selectButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  selectButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SelectEventScreen; 