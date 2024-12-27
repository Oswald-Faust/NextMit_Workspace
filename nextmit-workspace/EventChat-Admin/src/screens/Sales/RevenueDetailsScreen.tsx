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
import { RouteProp } from '@react-navigation/native';
import { SalesStackParamList } from '../../navigation/types';
import { LineChart, ProgressChart } from 'react-native-chart-kit';

type RevenueDetailsScreenProps = {
  navigation: NativeStackNavigationProp<SalesStackParamList, 'RevenueDetails'>;
  route: RouteProp<SalesStackParamList, 'RevenueDetails'>;
};

interface RevenueMetrics {
  current: number;
  previous: number;
  growth: number;
  target: number;
  completion: number;
}

interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
  growth: number;
}

interface DailyRevenue {
  date: string;
  amount: number;
  orders: number;
}

const RevenueDetailsScreen: React.FC<RevenueDetailsScreenProps> = ({ navigation, route }) => {
  const theme = useTheme<Theme>();
  const screenWidth = Dimensions.get('window').width;
  const [selectedView, setSelectedView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Données de démonstration
  const revenueMetrics: RevenueMetrics = {
    current: 45678.90,
    previous: 41234.56,
    growth: 10.78,
    target: 50000,
    completion: 0.91,
  };

  const revenueBreakdown: RevenueBreakdown[] = [
    {
      category: 'Menus principaux',
      amount: 25678.45,
      percentage: 56.2,
      growth: 12.5,
    },
    {
      category: 'Boissons',
      amount: 12345.67,
      percentage: 27.0,
      growth: 8.3,
    },
    {
      category: 'Desserts',
      amount: 4567.89,
      percentage: 10.0,
      growth: 15.7,
    },
    {
      category: 'Entrées',
      amount: 3086.89,
      percentage: 6.8,
      growth: -2.4,
    },
  ];

  const dailyRevenue: DailyRevenue[] = [
    { date: 'Lun', amount: 6789.45, orders: 45 },
    { date: 'Mar', amount: 7234.56, orders: 52 },
    { date: 'Mer', amount: 6543.21, orders: 48 },
    { date: 'Jeu', amount: 8765.43, orders: 63 },
    { date: 'Ven', amount: 7654.32, orders: 58 },
    { date: 'Sam', amount: 9876.54, orders: 72 },
    { date: 'Dim', amount: 8765.43, orders: 65 },
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

  const revenueData = {
    labels: dailyRevenue.map(day => day.date),
    datasets: [
      {
        data: dailyRevenue.map(day => day.amount),
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const progressData = {
    labels: ['Objectif'], // optional
    data: [revenueMetrics.completion],
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  const renderMetricCard = (
    title: string,
    value: string,
    subtitle: string,
    trend?: number,
    icon?: keyof typeof Ionicons.glyphMap
  ) => (
    <View style={[styles.metricCard, { backgroundColor: theme.colors.inputBackground }]}>
      <View style={styles.metricHeader}>
        {icon && <Ionicons name={icon} size={24} color={theme.colors.primary} />}
        <Text style={[styles.metricTitle, { color: theme.colors.textSecondary }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.metricValue, { color: theme.colors.text }]}>{value}</Text>
      <View style={styles.metricFooter}>
        <Text style={[styles.metricSubtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
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
          Détails des revenus
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
        {/* Vue sélecteur */}
        <View style={styles.viewSelector}>
          <TouchableOpacity
            style={[
              styles.viewOption,
              {
                backgroundColor:
                  selectedView === 'daily'
                    ? theme.colors.primary
                    : theme.colors.inputBackground,
              },
            ]}
            onPress={() => setSelectedView('daily')}
          >
            <Text
              style={[
                styles.viewOptionText,
                {
                  color:
                    selectedView === 'daily' ? '#FFF' : theme.colors.textSecondary,
                },
              ]}
            >
              Jour
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewOption,
              {
                backgroundColor:
                  selectedView === 'weekly'
                    ? theme.colors.primary
                    : theme.colors.inputBackground,
              },
            ]}
            onPress={() => setSelectedView('weekly')}
          >
            <Text
              style={[
                styles.viewOptionText,
                {
                  color:
                    selectedView === 'weekly' ? '#FFF' : theme.colors.textSecondary,
                },
              ]}
            >
              Semaine
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewOption,
              {
                backgroundColor:
                  selectedView === 'monthly'
                    ? theme.colors.primary
                    : theme.colors.inputBackground,
              },
            ]}
            onPress={() => setSelectedView('monthly')}
          >
            <Text
              style={[
                styles.viewOptionText,
                {
                  color:
                    selectedView === 'monthly' ? '#FFF' : theme.colors.textSecondary,
                },
              ]}
            >
              Mois
            </Text>
          </TouchableOpacity>
        </View>

        {/* Métriques principales */}
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Revenus actuels',
            formatCurrency(revenueMetrics.current),
            'vs. période précédente',
            revenueMetrics.growth,
            'cash-outline'
          )}
          {renderMetricCard(
            'Objectif',
            formatCurrency(revenueMetrics.target),
            `${(revenueMetrics.completion * 100).toFixed(1)}% atteint`,
            undefined,
            'flag-outline'
          )}
        </View>

        {/* Graphique de progression */}
        <View style={[styles.progressCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Progression vers l'objectif
          </Text>
          <ProgressChart
            data={progressData}
            width={screenWidth - 40}
            height={160}
            strokeWidth={16}
            radius={64}
            chartConfig={chartConfig}
            hideLegend={false}
          />
        </View>

        {/* Graphique d'évolution */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Évolution des revenus
          </Text>
          <LineChart
            data={revenueData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Répartition des revenus */}
        <View style={[styles.breakdownCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Répartition par catégorie
          </Text>
          {revenueBreakdown.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <View style={styles.breakdownHeader}>
                <Text style={[styles.breakdownCategory, { color: theme.colors.text }]}>
                  {item.category}
                </Text>
                <Text style={[styles.breakdownAmount, { color: theme.colors.text }]}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
              <View style={styles.breakdownProgressContainer}>
                <View
                  style={[
                    styles.breakdownProgress,
                    { backgroundColor: theme.colors.primary, width: `${item.percentage}%` },
                  ]}
                />
              </View>
              <View style={styles.breakdownFooter}>
                <Text style={[styles.breakdownPercentage, { color: theme.colors.textSecondary }]}>
                  {item.percentage}% du total
                </Text>
                <View style={styles.breakdownTrend}>
                  <Ionicons
                    name={item.growth >= 0 ? 'trending-up' : 'trending-down'}
                    size={16}
                    color={item.growth >= 0 ? '#2ecc71' : '#e74c3c'}
                  />
                  <Text
                    style={[
                      styles.breakdownGrowth,
                      { color: item.growth >= 0 ? '#2ecc71' : '#e74c3c' },
                    ]}
                  >
                    {Math.abs(item.growth)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Détails quotidiens */}
        <View style={[styles.dailyCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Détails quotidiens
          </Text>
          {dailyRevenue.map((day, index) => (
            <View
              key={index}
              style={[
                styles.dailyItem,
                index < dailyRevenue.length - 1 && styles.dailyItemBorder,
              ]}
            >
              <Text style={[styles.dailyDate, { color: theme.colors.text }]}>
                {day.date}
              </Text>
              <View style={styles.dailyDetails}>
                <View style={styles.dailyMetric}>
                  <Ionicons name="cash-outline" size={16} color={theme.colors.primary} />
                  <Text style={[styles.dailyAmount, { color: theme.colors.text }]}>
                    {formatCurrency(day.amount)}
                  </Text>
                </View>
                <View style={styles.dailyMetric}>
                  <Ionicons name="cart-outline" size={16} color={theme.colors.primary} />
                  <Text style={[styles.dailyOrders, { color: theme.colors.text }]}>
                    {day.orders} commandes
                  </Text>
                </View>
              </View>
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
  viewSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 25,
    padding: 4,
  },
  viewOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  viewOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    margin: 5,
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
  metricFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricSubtitle: {
    fontSize: 12,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  progressCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
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
  breakdownCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  breakdownItem: {
    marginBottom: 15,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownCategory: {
    fontSize: 14,
    fontWeight: '500',
  },
  breakdownAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  breakdownProgressContainer: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginBottom: 8,
  },
  breakdownProgress: {
    height: '100%',
    borderRadius: 3,
  },
  breakdownFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownPercentage: {
    fontSize: 12,
  },
  breakdownTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownGrowth: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  dailyCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  dailyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dailyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dailyDate: {
    fontSize: 14,
    fontWeight: '500',
    width: 50,
  },
  dailyDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 15,
  },
  dailyMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  dailyOrders: {
    fontSize: 14,
    marginLeft: 6,
  },
});

export default RevenueDetailsScreen; 