import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type HeaderBackProps = {
  title: string;
  subtitle?: string;
};

const HeaderBack: React.FC<HeaderBackProps> = ({ title, subtitle }) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    header: {
      padding: 20,
      backgroundColor: theme.colors.primary,
    },
    backButton: {
      marginBottom: 15,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.white,
      marginBottom: subtitle ? 10 : 0,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.white,
      opacity: 0.8,
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color={theme.colors.white} 
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );
};

export default HeaderBack; 