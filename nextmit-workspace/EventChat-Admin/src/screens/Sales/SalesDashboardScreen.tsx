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
import { LineChart } from 'react-native-chart-kit';

type SalesDashboardScreenProps = {
  navigation: NativeStackNavigationProp<SalesStackParamList, 'SalesDashboard'>;
};

interface SalesSummary {
  totalRevenue: number;
  ordersCount: number;
  averageOrderValue: number;
  conversionRate: number;
}

interface TopProduct {
  id: string;
  name: string;
  revenue: number;
  quantity: number;
  growth: number;
}

const SalesDashboardScreen: React.FC<SalesDashboardScreenProps> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const screenWidth = Dimensions.get('window').width;

  // Données de démonstration
  const salesSummary: SalesSummary = {
    totalRevenue: 45678.90,
    ordersCount: 234,
    averageOrderValue: 195.21,
    conversionRate: 3.45,
  };

  const topProducts: TopProduct[] = [
    {
      id: '1',
      name: 'Menu Gourmet Deluxe',
      revenue: 12500,
      quantity: 125,
      growth: 15.4,
    },
    {
      id: '2',
      name: 'Formule Cocktail Premium',
      revenue: 8900,
      quantity: 89,
      growth: 8.7,
    },
    {
      id: '3',
      name: 'Menu Végétarien Bio',
      revenue: 6700,
      quantity: 67,
      growth: 12.3,
    },
  ];

  const chartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        data: [2500, 3200, 2800, 4500, 3800, 5200, 4800],
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };

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

  const periods = [
    { id: 'day', label: 'Jour' },
    { id: 'week', label: 'Semaine' },
    { id: 'month', label: 'Mois' },
    { id: 'year', label: 'Année' },
  ];

  const navigateToAnalytics = () => {
    navigation.navigate('SalesAnalytics');
  };

  const navigateToRevenueDetails = () => {
    navigation.navigate('RevenueDetails', { period: selectedPeriod });
  };

  const navigateToProductPerformance = (productId: string) => {
    navigation.navigate('ProductPerformance', { productId });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  const renderSummaryCard = (
    title: string,
    value: string | number,
    icon: keyof typeof Ionicons.glyphMap,
    trend?: number,
  ) => (
    <TouchableOpacity
      style={[styles.summaryCard, { backgroundColor: theme.colors.inputBackground }]}
      onPress={navigateToRevenueDetails}
    >
      <View style={styles.summaryHeader}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
        <Text style={[styles.summaryTitle, { color: theme.colors.textSecondary }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
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
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Ventes
        </Text>
        <TouchableOpacity
          style={[styles.analyticsButton, { backgroundColor: theme.colors.primary }]}
          onPress={navigateToAnalytics}
        >
          <Ionicons name="analytics" size={20} color="#FFF" />
          <Text style={styles.analyticsButtonText}>Analyses</Text>
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

        {/* Cartes de résumé */}
        <View style={styles.summaryGrid}>
          {renderSummaryCard(
            'Chiffre d\'affaires',
            formatCurrency(salesSummary.totalRevenue),
            'cash-outline',
            8.5
          )}
          {renderSummaryCard(
            'Commandes',
            salesSummary.ordersCount.toString(),
            'cart-outline',
            5.2
          )}
          {renderSummaryCard(
            'Panier moyen',
            formatCurrency(salesSummary.averageOrderValue),
            'basket-outline',
            3.8
          )}
          {renderSummaryCard(
            'Taux de conversion',
            `${salesSummary.conversionRate}%`,
            'trending-up-outline',
            -2.1
          )}
        </View>

        {/* Graphique des ventes */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.inputBackground }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
              Évolution des ventes
            </Text>
            <TouchableOpacity onPress={navigateToAnalytics}>
              <Text style={[styles.chartLink, { color: theme.colors.primary }]}>
                Voir plus
              </Text>
            </TouchableOpacity>
          </View>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Meilleurs produits */}
        <View style={styles.topProductsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Meilleurs produits
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductPerformance', { productId: 'all' })}>
              <Text style={[styles.sectionLink, { color: theme.colors.primary }]}>
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>
          {topProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[styles.productCard, { backgroundColor: theme.colors.inputBackground }]}
              onPress={() => navigateToProductPerformance(product.id)}
            >
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: theme.colors.text }]}>
                  {product.name}
                </Text>
                <View style={styles.productStats}>
                  <Text style={[styles.productRevenue, { color: theme.colors.textSecondary }]}>
                    {formatCurrency(product.revenue)}
                  </Text>
                  <Text style={[styles.productQuantity, { color: theme.colors.textSecondary }]}>
                    {product.quantity} vendus
                  </Text>
                </View>
              </View>
              <View style={styles.productGrowth}>
                <Ionicons
                  name={product.growth >= 0 ? 'trending-up' : 'trending-down'}
                  size={20}
                  color={product.growth >= 0 ? '#2ecc71' : '#e74c3c'}
                />
                <Text
                  style={[
                    styles.growthText,
                    { color: product.growth >= 0 ? '#2ecc71' : '#e74c3c' },
                  ]}
                >
                  {product.growth}%
                </Text>
              </View>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  analyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  analyticsButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginBottom: 20,
  },
  summaryCard: {
    width: '48%',
    margin: '1%',
    padding: 15,
    borderRadius: 15,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 14,
    marginLeft: 8,
  },
  summaryValue: {
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 15,
  },
  topProductsSection: {
    marginBottom: 20,
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
  sectionLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  productStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productRevenue: {
    fontSize: 14,
    marginRight: 15,
  },
  productQuantity: {
    fontSize: 14,
  },
  productGrowth: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  growthText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default SalesDashboardScreen; 