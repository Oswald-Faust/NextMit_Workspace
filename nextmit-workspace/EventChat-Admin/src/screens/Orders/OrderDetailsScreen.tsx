import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OrdersStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type OrderDetailsScreenProps = {
  navigation: NativeStackNavigationProp<OrdersStackParamList, 'OrderDetails'>;
  route: {
    params: {
      orderId: string;
    };
  };
};

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  options?: string[];
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  notes?: string;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ navigation, route }) => {
  const theme = useTheme<Theme>();
  const [showOptions, setShowOptions] = useState(false);

  // Données de démonstration (à remplacer par un appel API)
  const order: Order = {
    id: route.params.orderId,
    orderNumber: 'CMD-2024-001',
    customerName: 'Sophie Martin',
    customerPhone: '+33 6 12 34 56 78',
    customerEmail: 'sophie.martin@email.com',
    date: '15 Juin 2024',
    time: '14:30',
    status: 'pending',
    items: [
      {
        id: '1',
        name: 'Burger Gourmet',
        quantity: 2,
        price: 15,
        options: ['Sans oignon', 'Sauce à part'],
        notes: 'Bien cuit s\'il vous plaît',
      },
      {
        id: '2',
        name: 'Frites Maison',
        quantity: 2,
        price: 5,
      },
      {
        id: '3',
        name: 'Coca-Cola',
        quantity: 2,
        price: 3,
      },
    ],
    subtotal: 46,
    tax: 4,
    total: 50,
    eventName: 'Festival d\'été 2024',
    eventDate: '15-17 Juin 2024',
    eventLocation: 'Parc des Expositions, Paris',
    notes: 'Livraison au stand 23B',
    paymentMethod: 'Carte Bancaire',
    paymentStatus: 'paid',
  };

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

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'pending':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'delivered';
      default:
        return null;
    }
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    // Implémenter la logique de changement de statut
    console.log('Changing status to:', newStatus);
  };

  const renderOrderItem = (item: OrderItem) => (
    <View key={item.id} style={styles.orderItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemQuantity}>
          <Text style={[styles.quantityText, { color: theme.colors.primary }]}>
            {item.quantity}x
          </Text>
        </View>
        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemPrice, { color: theme.colors.textSecondary }]}>
            {(item.price * item.quantity).toFixed(2)}€
          </Text>
        </View>
      </View>
      {item.options && item.options.length > 0 && (
        <View style={styles.itemOptions}>
          {item.options.map((option, index) => (
            <View key={index} style={styles.optionTag}>
              <Text style={styles.optionText}>{option}</Text>
            </View>
          ))}
        </View>
      )}
      {item.notes && (
        <Text style={[styles.itemNotes, { color: theme.colors.textSecondary }]}>
          Note: {item.notes}
        </Text>
      )}
    </View>
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
        <View style={styles.headerTitle}>
          <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
            {order.orderNumber}
          </Text>
          <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>
            {order.date} à {order.time}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => setShowOptions(!showOptions)}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Statut de la commande */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Statut de la commande
            </Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: `${getStatusColor(order.status)}10` }]}>
            <View style={styles.statusInfo}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {getStatusLabel(order.status)}
              </Text>
            </View>
            {getNextStatus(order.status) && (
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: getStatusColor(getNextStatus(order.status)!) }]}
                onPress={() => handleStatusChange(getNextStatus(order.status)!)}
              >
                <Text style={styles.statusButtonText}>
                  Passer à {getStatusLabel(getNextStatus(order.status)!).toLowerCase()}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Informations client */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Client
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.colors.inputBackground }]}>
            <Text style={[styles.customerName, { color: theme.colors.text }]}>
              {order.customerName}
            </Text>
            <View style={styles.contactInfo}>
              <TouchableOpacity style={styles.contactItem}>
                <Ionicons name="call-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
                  {order.customerPhone}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactItem}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
                  {order.customerEmail}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Événement */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Événement
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.colors.inputBackground }]}>
            <Text style={[styles.eventName, { color: theme.colors.text }]}>
              {order.eventName}
            </Text>
            <View style={styles.eventInfo}>
              <View style={styles.eventInfoItem}>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.eventInfoText, { color: theme.colors.textSecondary }]}>
                  {order.eventDate}
                </Text>
              </View>
              <View style={styles.eventInfoItem}>
                <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.eventInfoText, { color: theme.colors.textSecondary }]}>
                  {order.eventLocation}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Articles commandés */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Articles commandés
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.colors.inputBackground }]}>
            {order.items.map(renderOrderItem)}
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Sous-total
                </Text>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  {order.subtotal.toFixed(2)}€
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  TVA
                </Text>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  {order.tax.toFixed(2)}€
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
                  Total
                </Text>
                <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
                  {order.total.toFixed(2)}€
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Paiement */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Paiement
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.colors.inputBackground }]}>
            <View style={styles.paymentInfo}>
              <View style={styles.paymentMethod}>
                <Ionicons name="card-outline" size={24} color={theme.colors.primary} />
                <Text style={[styles.paymentMethodText, { color: theme.colors.text }]}>
                  {order.paymentMethod}
                </Text>
              </View>
              <View style={[
                styles.paymentStatus,
                { backgroundColor: order.paymentStatus === 'paid' ? '#2ecc7120' : '#e74c3c20' }
              ]}>
                <Text style={[
                  styles.paymentStatusText,
                  { color: order.paymentStatus === 'paid' ? '#2ecc71' : '#e74c3c' }
                ]}>
                  {order.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notes */}
        {order.notes && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Notes
              </Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.colors.inputBackground }]}>
              <Text style={[styles.notes, { color: theme.colors.textSecondary }]}>
                {order.notes}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Actions rapides */}
      <View style={[styles.quickActions, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {/* Implémenter l'action */}}
        >
          <Ionicons name="print-outline" size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>Imprimer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={() => {/* Implémenter l'action */}}
        >
          <Ionicons name="close-circle-outline" size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
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
  },
  headerTitle: {
    flex: 1,
    marginLeft: 15,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
  },
  optionsButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    padding: 15,
    borderRadius: 12,
  },
  statusCard: {
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  contactInfo: {
    marginTop: 5,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 14,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  eventInfo: {
    marginTop: 5,
  },
  eventInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventInfoText: {
    marginLeft: 10,
    fontSize: 14,
  },
  orderItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    marginRight: 10,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    marginTop: 2,
  },
  itemOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  optionTag: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 12,
    color: '#666',
  },
  itemNotes: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
  orderSummary: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    marginLeft: 10,
    fontSize: 16,
  },
  paymentStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paymentStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  notes: {
    fontSize: 14,
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default OrderDetailsScreen; 