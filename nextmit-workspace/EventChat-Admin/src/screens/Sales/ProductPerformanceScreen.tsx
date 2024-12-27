import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SalesStackParamList } from '../../navigation/types';
import { LineChart, BarChart } from 'react-native-chart-kit';

type ProductPerformanceScreenProps = {
  navigation: NativeStackNavigationProp<SalesStackParamList, 'ProductPerformance'>;
  route: RouteProp<SalesStackParamList, 'ProductPerformance'>;
};

interface ProductDetails {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  totalSales: number;
  totalRevenue: number;
  growth: number;
  rating: number;
  reviews: number;
  stock: number;
  salesHistory: {
    date: string;
    quantity: number;
    revenue: number;
  }[];
  topEvents: {
    name: string;
    sales: number;
    revenue: number;
  }[];
  variations: {
    name: string;
    sales: number;
    percentage: number;
  }[];
}

const ProductPerformanceScreen: React.FC<ProductPerformanceScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme<Theme>();
  const screenWidth = Dimensions.get('window').width;
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Données de démonstration
  const productDetails: ProductDetails = {
    id: '1',
    name: 'Menu Gourmet Deluxe',
    category: 'Menus principaux',
    price: 89.90,
    image: 'https://example.com/menu-gourmet.jpg',
    totalSales: 1250,
    totalRevenue: 112375.00,
    growth: 15.4,
    rating: 4.8,
    reviews: 342,
    stock: 0, // Service, pas de stock
    salesHistory: [
      { date: 'Lun', quantity: 45, revenue: 4045.50 },
      { date: 'Mar', quantity: 52, revenue: 4674.80 },
      { date: 'Mer', quantity: 48, revenue: 4315.20 },
      { date: 'Jeu', quantity: 63, revenue: 5663.70 },
      { date: 'Ven', quantity: 58, revenue: 5214.20 },
      { date: 'Sam', quantity: 72, revenue: 6472.80 },
      { date: 'Dim', quantity: 65, revenue: 5843.50 },
    ],
    topEvents: [
      { name: 'Festival d\'été 2024', sales: 250, revenue: 22475.00 },
      { name: 'Gala de charité', sales: 180, revenue: 16182.00 },
      { name: 'Soirée d\'entreprise', sales: 150, revenue: 13485.00 },
    ],
    variations: [
      { name: 'Standard', sales: 750, percentage: 60 },
      { name: 'Végétarien', sales: 300, percentage: 24 },
      { name: 'Sans gluten', sales: 200, percentage: 16 },
    ],
  };

  const periods = [
    { id: 'day', label: 'Jour' },
    { id: 'week', label: 'Semaine' },
    { id: 'month', label: 'Mois' },
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

  const salesData = {
    labels: productDetails.salesHistory.map(day => day.date),
    datasets: [
      {
        data: productDetails.salesHistory.map(day => day.revenue),
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const quantityData = {
    labels: productDetails.salesHistory.map(day => day.date),
    datasets: [
      {
        data: productDetails.salesHistory.map(day => day.quantity),
        color: (opacity = 1) => theme.colors.primary,
      },
    ],
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  const renderMetricCard = (
    title: string,
    value: string | number,
    icon: keyof typeof Ionicons.glyphMap,
    trend?: number,
  ) => (
    <View style={[styles.metricCard, { backgroundColor: theme.colors.inputBackground }]}>
      <View style={styles.metricHeader}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
        <Text style={[styles.metricTitle, { color: theme.colors.textSecondary }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.metricValue, { color: theme.colors.text }]}>
        {value}
      </Text>
      {trend !== undefined && (
        <View style={styles.trendContainer}>
          <Ionicons
            name={trend >= 0 ? 'trending-up' : 'trending-down'}
            size={16}
            color={trend >= 0 ? '#2ecc71' : '#e74c3c'}
          />
          <Text
            style={[
              styles.trendText,
              { color: trend >= 0 ? '#2ecc71' : '#e74c3c' },
            ]}
          >
            {Math.abs(trend)}%
          </Text>
        </View>
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Performance du produit
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
        {/* Informations produit */}
        <View style={[styles.productCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Image
            source={{ uri: productDetails.image }}
            style={styles.productImage}
            defaultSource={require('../../assets/logo.png')}
          />
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: theme.colors.text }]}>
              {productDetails.name}
            </Text>
            <Text style={[styles.productCategory, { color: theme.colors.textSecondary }]}>
              {productDetails.category}
            </Text>
            <Text style={[styles.productPrice, { color: theme.colors.primary }]}>
              {formatCurrency(productDetails.price)}
            </Text>
          </View>
        </View>

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

        {/* Métriques principales */}
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Ventes totales',
            productDetails.totalSales,
            'cart-outline',
            productDetails.growth
          )}
          {renderMetricCard(
            'Chiffre d\'affaires',
            formatCurrency(productDetails.totalRevenue),
            'cash-outline',
            productDetails.growth
          )}
          {renderMetricCard(
            'Note moyenne',
            `${productDetails.rating}/5`,
            'star-outline'
          )}
          {renderMetricCard(
            'Avis',
            productDetails.reviews,
            'chatbubble-outline'
          )}
        </View>

        {/* Graphique des ventes */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Évolution du chiffre d'affaires
          </Text>
          <LineChart
            data={salesData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Graphique des quantités */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Évolution des quantités vendues
          </Text>
          <BarChart
            data={quantityData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </View>

        {/* Meilleurs événements */}
        <View style={[styles.eventsCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Meilleurs événements
          </Text>
          {productDetails.topEvents.map((event, index) => (
            <View
              key={index}
              style={[
                styles.eventItem,
                index < productDetails.topEvents.length - 1 && styles.eventItemBorder,
              ]}
            >
              <View style={styles.eventInfo}>
                <Text style={[styles.eventName, { color: theme.colors.text }]}>
                  {event.name}
                </Text>
                <Text style={[styles.eventSales, { color: theme.colors.textSecondary }]}>
                  {event.sales} ventes
                </Text>
              </View>
              <Text style={[styles.eventRevenue, { color: theme.colors.primary }]}>
                {formatCurrency(event.revenue)}
              </Text>
            </View>
          ))}
        </View>

        {/* Variations du produit */}
        <View style={[styles.variationsCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Variations du produit
          </Text>
          {productDetails.variations.map((variation, index) => (
            <View key={index} style={styles.variationItem}>
              <View style={styles.variationHeader}>
                <Text style={[styles.variationName, { color: theme.colors.text }]}>
                  {variation.name}
                </Text>
                <Text style={[styles.variationSales, { color: theme.colors.textSecondary }]}>
                  {variation.sales} ventes
                </Text>
              </View>
              <View style={styles.variationProgressContainer}>
                <View
                  style={[
                    styles.variationProgress,
                    { backgroundColor: theme.colors.primary, width: `${variation.percentage}%` },
                  ]}
                />
              </View>
              <Text style={[styles.variationPercentage, { color: theme.colors.textSecondary }]}>
                {variation.percentage}% des ventes
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
  productCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 14,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    margin: '1%',
    padding: 15,
    borderRadius: 15,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricTitle: {
    fontSize: 14,
    marginLeft: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  chartCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 15,
  },
  eventsCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  eventItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  eventSales: {
    fontSize: 12,
  },
  eventRevenue: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 15,
  },
  variationsCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  variationItem: {
    marginBottom: 15,
  },
  variationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  variationName: {
    fontSize: 14,
    fontWeight: '500',
  },
  variationSales: {
    fontSize: 12,
  },
  variationProgressContainer: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginBottom: 8,
  },
  variationProgress: {
    height: '100%',
    borderRadius: 3,
  },
  variationPercentage: {
    fontSize: 12,
  },
});

export default ProductPerformanceScreen; 