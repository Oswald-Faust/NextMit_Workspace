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
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

type SalesAnalyticsScreenProps = {
  navigation: NativeStackNavigationProp<SalesStackParamList, 'SalesAnalytics'>;
};

interface AnalyticsData {
  revenue: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  categories: {
    name: string;
    value: number;
    color: string;
  }[];
  performance: {
    period: string;
    revenue: number;
    growth: number;
  }[];
}

const SalesAnalyticsScreen: React.FC<SalesAnalyticsScreenProps> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const screenWidth = Dimensions.get('window').width;

  // Données de démonstration
  const analyticsData: AnalyticsData = {
    revenue: {
      daily: [2500, 3200, 2800, 4500, 3800, 5200, 4800],
      weekly: [15000, 18000, 16500, 21000, 19500],
      monthly: [65000, 72000, 68000, 85000, 78000, 92000],
    },
    categories: [
      { name: 'Menus', value: 45, color: '#FF6B6B' },
      { name: 'Boissons', value: 25, color: '#4ECDC4' },
      { name: 'Desserts', value: 15, color: '#45B7D1' },
      { name: 'Entrées', value: 15, color: '#96CEB4' },
    ],
    performance: [
      { period: 'Lun', revenue: 2500, growth: 5.2 },
      { period: 'Mar', revenue: 3200, growth: 8.7 },
      { period: 'Mer', revenue: 2800, growth: -2.1 },
      { period: 'Jeu', revenue: 4500, growth: 15.4 },
      { period: 'Ven', revenue: 3800, growth: 3.8 },
      { period: 'Sam', revenue: 5200, growth: 12.3 },
      { period: 'Dim', revenue: 4800, growth: 7.5 },
    ],
  };

  const metrics = [
    { id: 'revenue', label: 'Chiffre d\'affaires' },
    { id: 'orders', label: 'Commandes' },
    { id: 'average', label: 'Panier moyen' },
    { id: 'conversion', label: 'Conversion' },
  ];

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

  const revenueData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        data: analyticsData.revenue.daily,
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const categoryData = {
    labels: analyticsData.categories.map(cat => cat.name),
    data: analyticsData.categories.map(cat => cat.value / 100),
    colors: analyticsData.categories.map(cat => cat.color),
  };

  const performanceData = {
    labels: analyticsData.performance.map(perf => perf.period),
    datasets: [
      {
        data: analyticsData.performance.map(perf => perf.revenue),
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
          Analyses des ventes
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Sélecteurs de métriques et périodes */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.metricsSelector}
            contentContainerStyle={styles.metricsSelectorContent}
          >
            {metrics.map((metric) => (
              <TouchableOpacity
                key={metric.id}
                style={[
                  styles.metricChip,
                  {
                    backgroundColor:
                      selectedMetric === metric.id
                        ? theme.colors.primary
                        : theme.colors.inputBackground,
                  },
                ]}
                onPress={() => setSelectedMetric(metric.id)}
              >
                <Text
                  style={[
                    styles.metricText,
                    {
                      color:
                        selectedMetric === metric.id
                          ? '#FFF'
                          : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {metric.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

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
        </View>

        {/* Graphique principal */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Évolution du chiffre d'affaires
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

        {/* Répartition par catégorie */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Répartition par catégorie
          </Text>
          <PieChart
            data={analyticsData.categories.map((category) => ({
              name: category.name,
              population: category.value,
              color: category.color,
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

        {/* Performance par période */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.inputBackground }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Performance par période
          </Text>
          <BarChart
            data={performanceData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </View>

        {/* Indicateurs de performance */}
        <View style={styles.kpiSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Indicateurs clés
          </Text>
          <View style={styles.kpiGrid}>
            {analyticsData.performance.map((perf, index) => (
              <View
                key={index}
                style={[styles.kpiCard, { backgroundColor: theme.colors.inputBackground }]}
              >
                <Text style={[styles.kpiPeriod, { color: theme.colors.textSecondary }]}>
                  {perf.period}
                </Text>
                <Text style={[styles.kpiValue, { color: theme.colors.text }]}>
                  {formatCurrency(perf.revenue)}
                </Text>
                <View style={styles.kpiTrend}>
                  <Ionicons
                    name={perf.growth >= 0 ? 'trending-up' : 'trending-down'}
                    size={16}
                    color={perf.growth >= 0 ? '#2ecc71' : '#e74c3c'}
                  />
                  <Text
                    style={[
                      styles.kpiGrowth,
                      { color: perf.growth >= 0 ? '#2ecc71' : '#e74c3c' },
                    ]}
                  >
                    {Math.abs(perf.growth)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  metricsSelector: {
    marginBottom: 15,
  },
  metricsSelectorContent: {
    paddingRight: 20,
  },
  metricChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  metricText: {
    fontSize: 14,
    fontWeight: '500',
  },
  periodSelector: {
    maxHeight: 40,
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
  chartCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 15,
  },
  kpiSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  kpiCard: {
    width: '31%',
    margin: '1%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  kpiPeriod: {
    fontSize: 12,
    marginBottom: 5,
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  kpiTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kpiGrowth: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default SalesAnalyticsScreen; 