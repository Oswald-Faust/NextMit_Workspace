import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type EventDetailsScreenProps = {
  navigation: NativeStackNavigationProp<EventsStackParamList, 'EventDetails'>;
  route: {
    params: {
      eventId: string;
    };
  };
};

const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({ navigation, route }) => {
  const theme = useTheme<Theme>();
  const [isPositioned, setIsPositioned] = useState(false);

  // Données de démonstration (à remplacer par un appel API)
  const event = {
    id: route.params.eventId,
    name: 'Festival d\'été 2024',
    date: '15 Juin 2024',
    time: '14:00 - 23:00',
    location: 'Parc des Expositions, Paris',
    image: 'https://example.com/event1.jpg',
    price: '30.00',
    attendees: '1.2k',
    description: 'Le plus grand festival de l\'été avec des artistes internationaux. Une expérience unique avec de la musique live, des food trucks et des animations.',
    organizer: {
      name: 'EventPro Paris',
      image: 'https://example.com/organizer.jpg',
      rating: 4.8,
      events: 45,
    },
    requirements: [
      'Espace minimum de 3x3m',
      'Équipement électrique nécessaire',
      'Personnel requis : 2 minimum',
      'Licence alimentaire valide',
    ],
    benefits: [
      'Emplacement premium',
      'Accès aux zones VIP',
      'Support logistique inclus',
      'Promotion sur les réseaux sociaux',
    ],
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image de couverture */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.image }}
            style={styles.coverImage}
            defaultSource={require('../../assets/logo.png')}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* En-tête */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {event.name}
            </Text>
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              {event.price}€
            </Text>
          </View>

          {/* Informations de base */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                {event.date}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                {event.time}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                {event.location}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              À propos de l'événement
            </Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {event.description}
            </Text>
          </View>

          {/* Organisateur */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Organisateur
            </Text>
            <View style={styles.organizerCard}>
              <Image source={{ uri: event.organizer.image }} style={styles.organizerImage} />
              <View style={styles.organizerInfo}>
                <Text style={[styles.organizerName, { color: theme.colors.text }]}>
                  {event.organizer.name}
                </Text>
                <View style={styles.organizerStats}>
                  <View style={styles.stat}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                      {event.organizer.rating}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                      {event.organizer.events} événements
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Exigences */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Exigences
            </Text>
            {event.requirements.map((requirement, index) => (
              <View key={index} style={styles.requirementItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                <Text style={[styles.requirementText, { color: theme.colors.text }]}>
                  {requirement}
                </Text>
              </View>
            ))}
          </View>

          {/* Avantages */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Avantages
            </Text>
            {event.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="gift-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.benefitText, { color: theme.colors.text }]}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bouton d'action */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: isPositioned
                ? theme.colors.error
                : theme.colors.primary,
            },
          ]}
          onPress={() => setIsPositioned(!isPositioned)}
        >
          <Text style={styles.actionButtonText}>
            {isPositioned ? 'Annuler le positionnement' : 'Se positionner sur l\'événement'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  organizerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  organizerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    marginLeft: 5,
    fontSize: 14,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  requirementText: {
    marginLeft: 10,
    fontSize: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    marginLeft: 10,
    fontSize: 16,
  },
  actionContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#FFF',
  },
  actionButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventDetailsScreen; 