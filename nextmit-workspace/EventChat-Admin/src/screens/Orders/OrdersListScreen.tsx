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
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OrdersStackParamList } from '../../navigation/types';

type OrdersListScreenProps = {
  navigation: NativeStackNavigationProp<OrdersStackParamList, 'OrdersList'>;
};

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  time: string;
  status: OrderStatus;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  eventName: string;
}

const OrdersListScreen: React.FC<OrdersListScreenProps> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Données de démonstration
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'CMD-2024-001',
      customerName: 'Sophie Martin',
      date: '15 Juin 2024',
      time: '14:30',
      status: 'pending',
      items: [
        { name: 'Burger Gourmet', quantity: 2, price: 15 },
        { name: 'Frites Maison', quantity: 2, price: 5 },
      ],
      total: 40,
      eventName: 'Festival d\'été 2024',
    },
    {
      id: '2',
      orderNumber: 'CMD-2024-002',
      customerName: 'Lucas Dubois',
      date: '15 Juin 2024',
      time: '15:00',
      status: 'preparing',
      items: [
        { name: 'Pizza Margherita', quantity: 1, price: 12 },
        { name: 'Tiramisu', quantity: 1, price: 6 },
      ],
      total: 18,
      eventName: 'Festival d\'été 2024',
    },
  ];

  const filters = [
    { id: 'all', label: 'Toutes', icon: 'apps-outline' },
    { id: 'pending', label: 'En attente', icon: 'time-outline' },
    { id: 'preparing', label: 'En préparation', icon: 'restaurant-outline' },
    { id: 'ready', label: 'Prêtes', icon: 'checkmark-circle-outline' },
    { id: 'delivered', label: 'Livrées', icon: 'checkmark-done-outline' },
    { id: 'cancelled', label: 'Annulées', icon: 'close-circle-outline' },
  ];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'preparing':
        return '#3498db';
      case 'ready':
        return '#2ecc71';
      case 'delivered':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'preparing':
        return 'En préparation';
      case 'ready':
        return 'Prête';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simuler un chargement
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetails', { orderId });
  };

  const renderOrderCard = (order: Order) => (
    <TouchableOpacity
      key={order.id}
      style={[styles.orderCard, { backgroundColor: theme.colors.background }]}
      onPress={() => handleOrderPress(order.id)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
            {order.orderNumber}
          </Text>
          <Text style={[styles.customerName, { color: theme.colors.textSecondary }]}>
            {order.customerName}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusLabel(order.status)}
          </Text>
        </View>
      </View>

      <View style={styles.orderInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            {order.date}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            {order.time}
          </Text>
        </View>
      </View>

      <View style={styles.eventInfo}>
        <Ionicons name="calendar" size={16} color={theme.colors.primary} />
        <Text style={[styles.eventName, { color: theme.colors.primary }]}>
          {order.eventName}
        </Text>
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.itemsSummary}>
          <Text style={[styles.itemsCount, { color: theme.colors.textSecondary }]}>
            {order.items.reduce((acc, item) => acc + item.quantity, 0)} articles
          </Text>
        </View>
        <Text style={[styles.totalPrice, { color: theme.colors.text }]}>
          {order.total.toFixed(2)}€
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* En-tête avec titre */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Commandes
        </Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.inputBackground }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Rechercher une commande..."
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

      {/* Liste des commandes */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.ordersList}
        contentContainerStyle={styles.ordersContent}
      >
        {orders.map(renderOrderCard)}
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
  ordersList: {
    flex: 1,
  },
  ordersContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  orderCard: {
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
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
  orderInfo: {
    flexDirection: 'row',
    marginBottom: 10,
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
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventName: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  itemsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemsCount: {
    fontSize: 14,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrdersListScreen; 