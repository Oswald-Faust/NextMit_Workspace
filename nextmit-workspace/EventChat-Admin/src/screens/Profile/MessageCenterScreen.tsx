import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import HeaderBack from '../../components/HeaderBack';

// À remplacer par les vraies données de l'API
const mockMessages = [
  {
    id: '1',
    type: 'message',
    sender: 'Support NextMit',
    content: 'Votre demande de participation a été acceptée',
    date: '2024-02-20T10:30:00',
    unread: true,
  },
  {
    id: '2',
    type: 'notification',
    title: 'Nouvel événement disponible',
    content: 'Un nouveau festival vient d\'être ajouté dans votre région',
    date: '2024-02-19T15:45:00',
    unread: false,
  },
];

const MessageCenterScreen: React.FC = () => {
  const theme = useTheme<Theme>();
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: theme.colors.primary,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.white,
      marginBottom: 10,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.cardPrimary,
      padding: 5,
      margin: 10,
      borderRadius: 12,
    },
    tab: {
      flex: 1,
      padding: 10,
      alignItems: 'center',
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: theme.colors.white,
      fontWeight: '600',
    },
    messageCard: {
      backgroundColor: theme.colors.cardPrimary,
      margin: 10,
      padding: 15,
      borderRadius: 12,
      borderLeftWidth: 4,
    },
    messageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    sender: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    date: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    content: {
      fontSize: 15,
      color: theme.colors.text,
      lineHeight: 20,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      position: 'absolute',
      top: 8,
      right: 8,
    },
  });

  const renderMessageCard = ({ item }: { item: typeof mockMessages[0] }) => (
    <View 
      style={[
        styles.messageCard,
        { 
          borderLeftColor: item.type === 'message' 
            ? theme.colors.primary 
            : theme.colors.secondary 
        }
      ]}
    >
      {item.unread && <View style={styles.unreadDot} />}
      
      <View style={styles.messageHeader}>
        <Text style={styles.sender}>
          {item.type === 'message' ? item.sender : item.title}
        </Text>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
          })}
        </Text>
      </View>
      
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderBack 
        title="Centre de messages"
        subtitle="Messages et notifications"
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'messages' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('messages')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'messages' && styles.activeTabText,
            ]}
          >
            Messages
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'notifications' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('notifications')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'notifications' && styles.activeTabText,
            ]}
          >
            Notifications
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockMessages.filter(msg => 
          activeTab === 'messages' 
            ? msg.type === 'message' 
            : msg.type === 'notification'
        )}
        renderItem={renderMessageCard}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default MessageCenterScreen; 