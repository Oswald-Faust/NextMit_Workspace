import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const theme = useTheme<Theme>();
  const { user, signOut } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const menuItems = [
    {
      id: 'myEvents',
      icon: 'calendar-outline',
      title: 'Mes événements',
      description: 'Consultez les événements où vous êtes restaurateur',
      onPress: () => navigation.navigate('MyEvents'),
    },
    {
      id: 'messages',
      icon: 'chatbubbles-outline',
      title: 'Centre de messages',
      description: 'Discussions avec l\'administration et historique des notifications',
      onPress: () => navigation.navigate('MessageCenter'),
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      title: 'Préférences de notifications',
      description: 'Personnalisez vos paramètres de notifications',
      onPress: () => navigation.navigate('NotificationPreferences'),
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      title: 'Paramètres du compte',
      description: 'Modifiez vos informations personnelles et professionnelles',
      onPress: () => navigation.navigate('AccountSettings'),
    },
    {
      id: 'help',
      icon: 'help-circle-outline',
      title: 'Aide et support',
      description: 'Contactez le support et consultez la documentation',
      onPress: () => navigation.navigate('Support'),
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: theme.colors.primary,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    profileInfo: {
      alignItems: 'center',
      marginBottom: 20,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.cardPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.white,
      marginBottom: 5,
    },
    role: {
      fontSize: 16,
      color: theme.colors.white,
      opacity: 0.8,
    },
    menuContainer: {
      padding: 20,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.cardPrimary,
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 15,
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    menuDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    logoutButton: {
      marginHorizontal: 20,
      marginBottom: 20,
      backgroundColor: theme.colors.error,
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
    },
    logoutText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color={theme.colors.primary} />
            </View>
            <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.role}>
              {user?.role === 'manager' ? 'Restaurateur' : user?.role}
            </Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <Ionicons 
                  name={item.icon as keyof typeof Ionicons.glyphMap} 
                  size={24} 
                  color={theme.colors.primary} 
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.textSecondary} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen; 