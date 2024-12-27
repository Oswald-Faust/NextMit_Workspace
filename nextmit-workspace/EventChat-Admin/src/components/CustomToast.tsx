import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';

type CustomToastProps = {
  visible: boolean;
  message: string;
  type: 'error' | 'success';
  onHide: () => void;
  duration?: number;
};

const CustomToast: React.FC<CustomToastProps> = ({
  visible,
  message,
  type,
  onHide,
  duration = 3000
}) => {
  const theme = useTheme<Theme>();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible, duration, opacity, onHide]);

  if (!visible) return null;

  const backgroundColor = type === 'error' 
    ? theme.colors.error 
    : theme.colors.success;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor, opacity }
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CustomToast; 