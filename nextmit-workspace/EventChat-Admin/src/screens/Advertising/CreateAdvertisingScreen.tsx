import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdvertisingStackParamList } from '../../navigation/types';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

type CreateAdvertisingScreenProps = {
  navigation: NativeStackNavigationProp<AdvertisingStackParamList, 'CreateAdvertising'>;
};

type AdType = 'banner' | 'popup' | 'story' | 'featured';

interface FormData {
  title: string;
  description: string;
  image: string | null;
  type: AdType;
  startDate: Date;
  endDate: Date;
  budget: string;
  eventId: string | null;
  eventName: string;
}

const CreateAdvertisingScreen: React.FC<CreateAdvertisingScreenProps> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    image: null,
    type: 'banner',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 jours par défaut
    budget: '',
    eventId: null,
    eventName: '',
  });

  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const adTypes: { id: AdType; label: string; description: string }[] = [
    {
      id: 'banner',
      label: 'Bannière',
      description: 'Apparaît en haut de l\'application',
    },
    {
      id: 'popup',
      label: 'Pop-up',
      description: 'S\'affiche au démarrage de l\'application',
    },
    {
      id: 'story',
      label: 'Story',
      description: 'Format plein écran temporaire',
    },
    {
      id: 'featured',
      label: 'À la une',
      description: 'Mise en avant dans les recommandations',
    },
  ];

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'Nous avons besoin de votre permission pour accéder à la galerie.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleSelectEvent = () => {
    navigation.navigate('SelectEvent');
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un titre');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir une description');
      return;
    }
    if (!formData.image) {
      Alert.alert('Erreur', 'Veuillez sélectionner une image');
      return;
    }
    if (!formData.eventId) {
      Alert.alert('Erreur', 'Veuillez sélectionner un événement');
      return;
    }
    if (!formData.budget || isNaN(Number(formData.budget))) {
      Alert.alert('Erreur', 'Veuillez saisir un budget valide');
      return;
    }

    // Envoyer les données
    console.log('Données de la publicité:', formData);
    // TODO: Implémenter l'envoi des données à l'API

    // Retourner à la liste
    navigation.goBack();
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
          Nouvelle publicité
        </Text>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Publier</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Image */}
        <TouchableOpacity
          style={[styles.imageUpload, { backgroundColor: theme.colors.inputBackground }]}
          onPress={handleImagePick}
        >
          {formData.image ? (
            <Image source={{ uri: formData.image }} style={styles.previewImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="image-outline" size={40} color={theme.colors.textSecondary} />
              <Text style={[styles.uploadText, { color: theme.colors.textSecondary }]}>
                Ajouter une image
              </Text>
              <Text style={[styles.uploadSubtext, { color: theme.colors.textSecondary }]}>
                Format recommandé : 16:9
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Formulaire */}
        <View style={styles.form}>
          {/* Titre */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Titre</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.text,
              }]}
              placeholder="Titre de votre publicité"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.text,
              }]}
              placeholder="Description de votre publicité"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />
          </View>

          {/* Type de publicité */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Type de publicité</Text>
            <View style={styles.adTypeGrid}>
              {adTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.adTypeCard,
                    { 
                      backgroundColor: theme.colors.inputBackground,
                      borderColor: formData.type === type.id ? theme.colors.primary : 'transparent',
                    },
                  ]}
                  onPress={() => setFormData({ ...formData, type: type.id })}
                >
                  <Text style={[styles.adTypeLabel, { color: theme.colors.text }]}>
                    {type.label}
                  </Text>
                  <Text style={[styles.adTypeDescription, { color: theme.colors.textSecondary }]}>
                    {type.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Dates */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Période</Text>
            <View style={styles.dateContainer}>
              <TouchableOpacity
                style={[styles.dateInput, { backgroundColor: theme.colors.inputBackground }]}
                onPress={() => setShowStartDate(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary} />
                <Text style={[styles.dateText, { color: theme.colors.text }]}>
                  {formData.startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>à</Text>
              <TouchableOpacity
                style={[styles.dateInput, { backgroundColor: theme.colors.inputBackground }]}
                onPress={() => setShowEndDate(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary} />
                <Text style={[styles.dateText, { color: theme.colors.text }]}>
                  {formData.endDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Budget */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Budget</Text>
            <View style={[styles.budgetInput, { backgroundColor: theme.colors.inputBackground }]}>
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="0"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
                value={formData.budget}
                onChangeText={(text) => setFormData({ ...formData, budget: text })}
              />
              <Text style={[styles.currencyText, { color: theme.colors.text }]}>€</Text>
            </View>
          </View>

          {/* Événement */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Événement</Text>
            <TouchableOpacity
              style={[styles.eventSelector, { backgroundColor: theme.colors.inputBackground }]}
              onPress={handleSelectEvent}
            >
              {formData.eventId ? (
                <Text style={[styles.eventName, { color: theme.colors.text }]}>
                  {formData.eventName}
                </Text>
              ) : (
                <Text style={[styles.eventPlaceholder, { color: theme.colors.textSecondary }]}>
                  Sélectionner un événement
                </Text>
              )}
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showStartDate && (
        <DateTimePicker
          value={formData.startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDate(false);
            if (selectedDate) {
              setFormData({ ...formData, startDate: selectedDate });
            }
          }}
          minimumDate={new Date()}
        />
      )}
      {showEndDate && (
        <DateTimePicker
          value={formData.endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDate(false);
            if (selectedDate) {
              setFormData({ ...formData, endDate: selectedDate });
            }
          }}
          minimumDate={formData.startDate}
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  imageUpload: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    marginTop: 10,
  },
  uploadSubtext: {
    fontSize: 12,
    marginTop: 5,
  },
  form: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  adTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  adTypeCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
  },
  adTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  adTypeDescription: {
    fontSize: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
  },
  budgetInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  currencyText: {
    fontSize: 16,
    marginLeft: 5,
  },
  eventSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  eventName: {
    fontSize: 16,
  },
  eventPlaceholder: {
    fontSize: 16,
  },
});

export default CreateAdvertisingScreen; 