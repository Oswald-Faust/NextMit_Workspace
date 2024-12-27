import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { AdvertisingStackParamList } from '../../navigation/types';

type AdvertisingDetailsScreenProps = {
  route: RouteProp<AdvertisingStackParamList, 'AdvertisingDetails'>;
};

const AdvertisingDetailsScreen: React.FC<AdvertisingDetailsScreenProps> = ({ route }) => {
  const { adId } = route.params;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Détails de la publicité {adId}</Text>
    </View>
  );
};

export default AdvertisingDetailsScreen; 