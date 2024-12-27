import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SalesStackParamList } from '../../navigation/types';
import { PieChart, LineChart } from 'react-native-chart-kit';

type CustomerInsightsScreenProps = {
  navigation: NativeStackNavigationProp<SalesStackParamList, 'CustomerInsights'>;
};

interface CustomerSegment {
  name: string;
  customers: number;
  revenue: number;
  percentage: number;
  growth: number;
  color: string;
}

interface CustomerBehavior {
  visitFrequency: {
    label: string;
    value: number;
    percentage: number;
  }[];
  orderSize: {
    label: string;
    value: number;
    percentage: number;
  }[];
  timeOfDay: {
    hour: string;
    orders: number;
  }[];
  satisfaction: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

interface TopCustomer {
  id: string;
  name: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  favorite: string;
}

const CustomerInsightsScreen: React.FC<CustomerInsightsScreenProps> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const screenWidth = Dimensions.get('window').width;
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Données de démonstration
  const customerSegments: CustomerSegment[] = [
    {
      name: 'Premium',
      customers: 250,
      revenue: 125000,
      percentage: 45,
      growth: 12.5,
      color: '#FF6B6B',
    },
    {
      name: 'Réguliers',
      customers: 450,
      revenue: 90000,
      percentage: 32,
      growth: 8.3,
      color: '#4ECDC4',
    },
    {
      name: 'Occasionnels',
      customers: 650,
      revenue: 45000,
      percentage: 16,
      growth: -2.4,
      color: '#45B7D1',
    },
    {
      name: 'Nouveaux',
      customers: 150,
      revenue: 18000,
      percentage: 7,
      growth: 15.7,
      color: '#96CEB4',
    },
  ];

  const customerBehavior: CustomerBehavior = {
    visitFrequency: [
      { label: 'Hebdomadaire', value: 350, percentage: 25 },
      { label: 'Bi-mensuel', value: 480, percentage: 35 },
      { label: 'Mensuel', value: 420, percentage: 30 },
      { label: 'Occasionnel', value: 150, percentage: 10 },
    ],
    orderSize: [
      { label: '< 50€', value: 280, percentage: 20 },
      { label: '50-100€', value: 560, percentage: 40 },
      { label: '100-200€', value: 420, percentage: 30 },
      { label: '> 200€', value: 140, percentage: 10 },
    ],
    timeOfDay: [
      { hour: '10h', orders: 45 },
      { hour: '12h', orders: 120 },
      { hour: '14h', orders: 85 },
      { hour: '16h', orders: 65 },
      { hour: '18h', orders: 95 },
      { hour: '20h', orders: 150 },
      { hour: '22h', orders: 80 },
    ],
    satisfaction: [
      { rating: 5, count: 450, percentage: 45 },
      { rating: 4, count: 350, percentage: 35 },
      { rating: 3, count: 150, percentage: 15 },
      { rating: 2, count: 40, percentage: 4 },
      { rating: 1, count: 10, percentage: 1 },
    ],
  };

  const topCustomers: TopCustomer[] = [
    {
      id: '1',
      name: 'Jean Dupont',
      orders: 25,
      totalSpent: 4500,
      lastOrder: '15/03/2024',
      favorite: 'Menu Gourmet Deluxe',
    },
    {
      id: '2',
      name: 'Marie Martin',
      orders: 18,
      totalSpent: 3200,
      lastOrder: '20/03/2024',
      favorite: 'Menu Végétarien Bio',
    },
    {
      id: '3',
      name: 'Pierre Durand',
      orders: 15,
      totalSpent: 2800,
      lastOrder: '18/03/2024',
      favorite: 'Formule Cocktail Premium',
    },
  ];

  const periods = [
    { id: 'week', label: 'Semaine' },
    { id: 'month', label: 'Mois' },
    { id: 'quarter', label: 'Trimestre' },
    { id: 'year', label: 'Année' },
  ];

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    color: (opacity = 1) => theme.colors.primary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: () => theme.colors.textSecondary,
    propsForLabels: {
      fontSize: 12,
    },
  };

  const orderTimeData = {
    labels: customerBehavior.timeOfDay.map(time => time.hour),
    datasets: [
      {
        data: customerBehavior.timeOfDay.map(time => time.orders),
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    });
  };

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
          Analyse des clients
        </Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => navigation.navigate('SalesReports')}
        >
          <Ionicons name="download-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Sélecteur de période */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.periodSelector}
          contentContainerStyle={styles.periodSelectorContent}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodChip,
                {
                  backgroundColor:
                    selectedPeriod === period.id
                      ? theme.colors.primary
                      : theme.colors.inputBackground,
                },
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodText,
                  {
                    color:
                      selectedPeriod === period.id
                        ? '#FFF'
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Segments de clients */}
        <View style={[styles.segmentsCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Segments de clients
          </Text>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={customerSegments.map((segment) => ({
                name: segment.name,
                population: segment.percentage,
                color: segment.color,
                legendFontColor: theme.colors.text,
                legendFontSize: 12,
              }))}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
          {customerSegments.map((segment, index) => (
            <View key={index} style={styles.segmentItem}>
              <View style={styles.segmentHeader}>
                <View style={styles.segmentTitleContainer}>
                  <View
                    style={[styles.segmentColorDot, { backgroundColor: segment.color }]}
                  />
                  <Text style={[styles.segmentName, { color: theme.colors.text }]}>
                    {segment.name}
                  </Text>
                </View>
                <Text style={[styles.segmentRevenue, { color: theme.colors.primary }]}>
                  {formatCurrency(segment.revenue)}
                </Text>
              </View>
              <View style={styles.segmentDetails}>
                <Text style={[styles.segmentCustomers, { color: theme.colors.textSecondary }]}>
                  {segment.customers} clients ({segment.percentage}%)
                </Text>
                <View style={styles.segmentGrowth}>
                  <Ionicons
                    name={segment.growth >= 0 ? 'trending-up' : 'trending-down'}
                    size={16}
                    color={segment.growth >= 0 ? '#2ecc71' : '#e74c3c'}
                  />
                  <Text
                    style={[
                      styles.growthText,
                      { color: segment.growth >= 0 ? '#2ecc71' : '#e74c3c' },
                    ]}
                  >
                    {Math.abs(segment.growth)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Comportement des clients */}
        <View style={[styles.behaviorCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Comportement d'achat
          </Text>
          <View style={styles.behaviorSection}>
            <Text style={[styles.behaviorTitle, { color: theme.colors.text }]}>
              Fréquence des visites
            </Text>
            {customerBehavior.visitFrequency.map((freq, index) => (
              <View key={index} style={styles.behaviorItem}>
                <View style={styles.behaviorHeader}>
                  <Text style={[styles.behaviorLabel, { color: theme.colors.text }]}>
                    {freq.label}
                  </Text>
                  <Text style={[styles.behaviorValue, { color: theme.colors.textSecondary }]}>
                    {freq.value} clients
                  </Text>
                </View>
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { backgroundColor: theme.colors.primary, width: `${freq.percentage}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Horaires des commandes */}
        <View style={[styles.timeCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Horaires des commandes
          </Text>
          <LineChart
            data={orderTimeData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Satisfaction client */}
        <View style={[styles.satisfactionCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Satisfaction client
          </Text>
          {customerBehavior.satisfaction.map((sat, index) => (
            <View key={index} style={styles.satisfactionItem}>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < sat.rating ? 'star' : 'star-outline'}
                    size={16}
                    color={i < sat.rating ? '#FFD700' : theme.colors.textSecondary}
                  />
                ))}
              </View>
              <View style={styles.satisfactionBar}>
                <View
                  style={[
                    styles.satisfactionProgress,
                    { backgroundColor: theme.colors.primary, width: `${sat.percentage}%` },
                  ]}
                />
              </View>
              <Text style={[styles.satisfactionPercentage, { color: theme.colors.textSecondary }]}>
                {sat.percentage}%
              </Text>
            </View>
          ))}
        </View>

        {/* Meilleurs clients */}
        <View style={[styles.topCustomersCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Meilleurs clients
          </Text>
          {topCustomers.map((customer, index) => (
            <View
              key={index}
              style={[
                styles.customerItem,
                index < topCustomers.length - 1 && styles.customerItemBorder,
              ]}
            >
              <View style={styles.customerInfo}>
                <Text style={[styles.customerName, { color: theme.colors.text }]}>
                  {customer.name}
                </Text>
                <Text style={[styles.customerDetails, { color: theme.colors.textSecondary }]}>
                  {customer.orders} commandes · Dernière: {customer.lastOrder}
                </Text>
                <Text style={[styles.customerFavorite, { color: theme.colors.textSecondary }]}>
                  Favori: {customer.favorite}
                </Text>
              </View>
              <Text style={[styles.customerSpent, { color: theme.colors.primary }]}>
                {formatCurrency(customer.totalSpent)}
              </Text>
            </View>
          ))}
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  exportButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  periodSelector: {
    marginBottom: 20,
  },
  periodSelectorContent: {
    paddingRight: 20,
  },
  periodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  segmentsCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  segmentItem: {
    marginBottom: 15,
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  segmentTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  segmentName: {
    fontSize: 14,
    fontWeight: '500',
  },
  segmentRevenue: {
    fontSize: 14,
    fontWeight: '600',
  },
  segmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  segmentCustomers: {
    fontSize: 12,
  },
  segmentGrowth: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  behaviorCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  behaviorSection: {
    marginBottom: 20,
  },
  behaviorTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  behaviorItem: {
    marginBottom: 10,
  },
  behaviorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  behaviorLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  behaviorValue: {
    fontSize: 12,
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  timeCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 15,
  },
  satisfactionCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  satisfactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    width: 100,
  },
  satisfactionBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginHorizontal: 10,
  },
  satisfactionProgress: {
    height: '100%',
    borderRadius: 3,
  },
  satisfactionPercentage: {
    width: 40,
    fontSize: 12,
    textAlign: 'right',
  },
  topCustomersCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  customerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  customerItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  customerDetails: {
    fontSize: 12,
    marginBottom: 2,
  },
  customerFavorite: {
    fontSize: 12,
  },
  customerSpent: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 15,
  },
});

export default CustomerInsightsScreen; 