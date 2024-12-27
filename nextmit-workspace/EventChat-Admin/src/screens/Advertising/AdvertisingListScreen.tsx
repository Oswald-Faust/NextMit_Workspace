import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdvertisingStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type AdvertisingListScreenProps = {
  navigation: NativeStackNavigationProp<AdvertisingStackParamList, 'AdvertisingList'>;
};

type AdStatus = 'draft' | 'pending' | 'active' | 'rejected' | 'ended';
type AdType = 'banner' | 'popup' | 'story' | 'featured';

interface Advertisement {
  id: string;
  title: string;
  description: string;
  image: string;
  type: AdType;
  status: AdStatus;
  startDate: string;
  endDate: string;
  budget: number;
  reach: number;
  clicks: number;
  eventName: string;
  createdAt: string;
}

const AdvertisingListScreen: React.FC<AdvertisingListScreenProps> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Données de démonstration
  const advertisements: Advertisement[] = [
    {
      id: '1',
      title: 'Festival d\'été - Promotion VIP',
      description: 'Accès exclusif aux zones VIP avec boissons offertes',
      image: 'https://example.com/ad1.jpg',
      type: 'banner',
      status: 'active',
      startDate: '15 Juin 2024',
      endDate: '20 Juin 2024',
      budget: 500,
      reach: 15000,
      clicks: 450,
      eventName: 'Festival d\'été 2024',
      createdAt: '01 Juin 2024',
    },
    {
      id: '2',
      title: 'Early Bird - Soirée Gastronomique',
      description: 'Réservez vos places à tarif préférentiel',
      image: 'https://example.com/ad2.jpg',
      type: 'popup',
      status: 'pending',
      startDate: '22 Juin 2024',
      endDate: '25 Juin 2024',
      budget: 300,
      reach: 0,
      clicks: 0,
      eventName: 'Soirée Gastronomique',
      createdAt: '05 Juin 2024',
    },
  ];

  const filters = [
    { id: 'all', label: 'Toutes', icon: 'apps-outline' },
    { id: 'active', label: 'Actives', icon: 'checkmark-circle-outline' },
    { id: 'pending', label: 'En attente', icon: 'time-outline' },
    { id: 'draft', label: 'Brouillons', icon: 'document-outline' },
    { id: 'ended', label: 'Terminées', icon: 'flag-outline' },
  ];

  const getStatusColor = (status: AdStatus) => {
    switch (status) {
      case 'active':
        return '#2ecc71';
      case 'pending':
        return '#f1c40f';
      case 'draft':
        return '#95a5a6';
      case 'rejected':
        return '#e74c3c';
      case 'ended':
        return '#34495e';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusLabel = (status: AdStatus) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'En attente';
      case 'draft':
        return 'Brouillon';
      case 'rejected':
        return 'Rejetée';
      case 'ended':
        return 'Terminée';
      default:
        return status;
    }
  };

  const getAdTypeLabel = (type: AdType) => {
    switch (type) {
      case 'banner':
        return 'Bannière';
      case 'popup':
        return 'Pop-up';
      case 'story':
        return 'Story';
      case 'featured':
        return 'À la une';
      default:
        return type;
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simuler un chargement
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleCreateAd = () => {
    navigation.navigate('CreateAdvertising');
  };

  const handleAdPress = (adId: string) => {
    navigation.navigate('AdvertisingDetails', { adId });
  };

  const renderAdCard = (ad: Advertisement) => (
    <TouchableOpacity
      key={ad.id}
      style={[styles.adCard, { backgroundColor: theme.colors.background }]}
      onPress={() => handleAdPress(ad.id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: ad.image }}
        style={styles.adImage}
        defaultSource={require('../../assets/logo.png')}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.adGradient}
      />
      <View style={styles.adTypeTag}>
        <Text style={styles.adTypeText}>{getAdTypeLabel(ad.type)}</Text>
      </View>
      <View style={styles.adContent}>
        <View style={styles.adHeader}>
          <Text style={styles.adTitle} numberOfLines={2}>
            {ad.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(ad.status)}20` }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(ad.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(ad.status) }]}>
              {getStatusLabel(ad.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.adDescription} numberOfLines={2}>
          {ad.description}
        </Text>

        <View style={styles.adStats}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={16} color="#FFF" />
            <Text style={styles.statText}>{ad.reach.toLocaleString()}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="finger-print-outline" size={16} color="#FFF" />
            <Text style={styles.statText}>{ad.clicks.toLocaleString()}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="wallet-outline" size={16} color="#FFF" />
            <Text style={styles.statText}>{ad.budget}€</Text>
          </View>
        </View>

        <View style={styles.adFooter}>
          <View style={styles.eventInfo}>
            <Ionicons name="calendar" size={16} color="#FFF" />
            <Text style={styles.eventName} numberOfLines={1}>
              {ad.eventName}
            </Text>
          </View>
          <Text style={styles.dateRange}>
            {ad.startDate} - {ad.endDate}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* En-tête avec titre */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Publicités
        </Text>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreateAd}
        >
          <Ionicons name="add" size={24} color="#FFF" />
          <Text style={styles.createButtonText}>Créer</Text>
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.inputBackground }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Rechercher une publicité..."
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

      {/* Liste des publicités */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.adsList}
        contentContainerStyle={styles.adsContent}
      >
        {advertisements.map(renderAdCard)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  adsList: {
    flex: 1,
  },
  adsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  adCard: {
    borderRadius: 15,
    marginBottom: 20,
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
  adImage: {
    width: '100%',
    height: 200,
  },
  adGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  adTypeTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  adTypeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  adContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  adTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginRight: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  adDescription: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 15,
  },
  adStats: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 14,
  },
  adFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventName: {
    color: '#FFF',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  dateRange: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.8,
  },
});

export default AdvertisingListScreen; 