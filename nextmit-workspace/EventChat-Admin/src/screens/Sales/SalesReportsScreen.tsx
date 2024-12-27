import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SalesStackParamList } from '../../navigation/types';

type SalesReportsScreenProps = {
  navigation: NativeStackNavigationProp<SalesStackParamList, 'SalesReports'>;
};

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  lastGenerated?: string;
}

interface SavedReport {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

const SalesReportsScreen: React.FC<SalesReportsScreenProps> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const [searchQuery, setSearchQuery] = useState('');

  // Données de démonstration
  const reportTemplates: ReportTemplate[] = [
    {
      id: '1',
      name: 'Rapport quotidien',
      description: 'Résumé des ventes, commandes et revenus du jour',
      icon: 'today-outline',
      type: 'daily',
      lastGenerated: '21/03/2024',
    },
    {
      id: '2',
      name: 'Rapport hebdomadaire',
      description: 'Analyse détaillée des performances de la semaine',
      icon: 'calendar-outline',
      type: 'weekly',
      lastGenerated: '17/03/2024',
    },
    {
      id: '3',
      name: 'Rapport mensuel',
      description: 'Bilan complet du mois avec analyses et prévisions',
      icon: 'stats-chart-outline',
      type: 'monthly',
      lastGenerated: '01/03/2024',
    },
    {
      id: '4',
      name: 'Rapport personnalisé',
      description: 'Créez un rapport sur mesure selon vos besoins',
      icon: 'options-outline',
      type: 'custom',
    },
  ];

  const savedReports: SavedReport[] = [
    {
      id: '1',
      name: 'Rapport_Mars_2024.pdf',
      type: 'Mensuel',
      date: '01/03/2024',
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'Rapport_Fevrier_2024.pdf',
      type: 'Mensuel',
      date: '01/02/2024',
      size: '2.1 MB',
    },
    {
      id: '3',
      name: 'Rapport_S11_2024.pdf',
      type: 'Hebdomadaire',
      date: '17/03/2024',
      size: '1.8 MB',
    },
    {
      id: '4',
      name: 'Rapport_21032024.pdf',
      type: 'Quotidien',
      date: '21/03/2024',
      size: '1.2 MB',
    },
  ];

  const handleGenerateReport = (template: ReportTemplate) => {
    // TODO: Implémenter la génération de rapport
    console.log('Générer rapport:', template.name);
  };

  const handleDownloadReport = (report: SavedReport) => {
    // TODO: Implémenter le téléchargement
    console.log('Télécharger rapport:', report.name);
  };

  const handleDeleteReport = (report: SavedReport) => {
    // TODO: Implémenter la suppression
    console.log('Supprimer rapport:', report.name);
  };

  const renderReportTemplate = (template: ReportTemplate) => (
    <TouchableOpacity
      key={template.id}
      style={[styles.templateCard, { backgroundColor: theme.colors.inputBackground }]}
      onPress={() => handleGenerateReport(template)}
    >
      <View style={styles.templateIcon}>
        <Ionicons name={template.icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.templateInfo}>
        <Text style={[styles.templateName, { color: theme.colors.text }]}>
          {template.name}
        </Text>
        <Text style={[styles.templateDescription, { color: theme.colors.textSecondary }]}>
          {template.description}
        </Text>
        {template.lastGenerated && (
          <Text style={[styles.templateLastGenerated, { color: theme.colors.textSecondary }]}>
            Dernier: {template.lastGenerated}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={[styles.generateButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => handleGenerateReport(template)}
      >
        <Ionicons name="add-outline" size={24} color="#FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSavedReport = (report: SavedReport) => (
    <View
      key={report.id}
      style={[styles.reportCard, { backgroundColor: theme.colors.inputBackground }]}
    >
      <View style={styles.reportInfo}>
        <View style={styles.reportHeader}>
          <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.reportName, { color: theme.colors.text }]}>
            {report.name}
          </Text>
        </View>
        <View style={styles.reportDetails}>
          <Text style={[styles.reportType, { color: theme.colors.textSecondary }]}>
            {report.type}
          </Text>
          <Text style={[styles.reportDate, { color: theme.colors.textSecondary }]}>
            {report.date}
          </Text>
          <Text style={[styles.reportSize, { color: theme.colors.textSecondary }]}>
            {report.size}
          </Text>
        </View>
      </View>
      <View style={styles.reportActions}>
        <TouchableOpacity
          style={styles.reportAction}
          onPress={() => handleDownloadReport(report)}
        >
          <Ionicons name="download-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reportAction}
          onPress={() => handleDeleteReport(report)}
        >
          <Ionicons name="trash-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
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
          Rapports
        </Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.inputBackground }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Rechercher un rapport..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Modèles de rapports */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Générer un rapport
          </Text>
          {reportTemplates.map(renderReportTemplate)}
        </View>

        {/* Rapports sauvegardés */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Rapports sauvegardés
          </Text>
          {savedReports.map(renderSavedReport)}
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 12,
    marginBottom: 4,
  },
  templateLastGenerated: {
    fontSize: 12,
  },
  generateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  reportInfo: {
    flex: 1,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  reportDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportType: {
    fontSize: 12,
    marginRight: 15,
  },
  reportDate: {
    fontSize: 12,
    marginRight: 15,
  },
  reportSize: {
    fontSize: 12,
  },
  reportActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportAction: {
    padding: 5,
    marginLeft: 10,
  },
});

export default SalesReportsScreen; 