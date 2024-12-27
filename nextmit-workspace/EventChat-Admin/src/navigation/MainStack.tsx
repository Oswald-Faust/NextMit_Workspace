import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import {
  MainStackParamList,
  EventsStackParamList,
  OrdersStackParamList,
  AdvertisingStackParamList,
  SalesStackParamList,
  ProfileStackParamList,
} from './types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';

// Import des écrans
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import EventsListScreen from '../screens/Events/EventsListScreen';
import EventDetailsScreen from '../screens/Events/EventDetailsScreen';
import OrdersListScreen from '../screens/Orders/OrdersListScreen';
import OrderDetailsScreen from '../screens/Orders/OrderDetailsScreen';
import AdvertisingListScreen from '../screens/Advertising/AdvertisingListScreen';
import CreateAdvertisingScreen from '../screens/Advertising/CreateAdvertisingScreen';
import AdvertisingDetailsScreen from '../screens/Advertising/AdvertisingDetailsScreen';
import SelectEventScreen from '../screens/Advertising/SelectEventScreen';
import SalesDashboardScreen from '../screens/Sales/SalesDashboardScreen';
import SalesAnalyticsScreen from '../screens/Sales/SalesAnalyticsScreen';
import RevenueDetailsScreen from '../screens/Sales/RevenueDetailsScreen';
import ProductPerformanceScreen from '../screens/Sales/ProductPerformanceScreen';
import CustomerInsightsScreen from '../screens/Sales/CustomerInsightsScreen';
import SalesReportsScreen from '../screens/Sales/SalesReportsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import MyEventsScreen from '../screens/Profile/MyEventsScreen';
import MessageCenterScreen from '../screens/Profile/MessageCenterScreen';
import NotificationPreferencesScreen from '../screens/Profile/NotificationPreferencesScreen';
import AccountSettingsScreen from '../screens/Profile/AccountSettingsScreen';
import SupportScreen from '../screens/Profile/SupportScreen';

const Tab = createBottomTabNavigator<MainStackParamList>();
const EventsStack = createNativeStackNavigator<EventsStackParamList>();
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();
const AdvertisingStack = createNativeStackNavigator<AdvertisingStackParamList>();
const SalesStack = createNativeStackNavigator<SalesStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

type EventDetailsScreenProps = {
  route: RouteProp<EventsStackParamList, 'EventDetails'>;
};

type OrderDetailsScreenProps = {
  route: RouteProp<OrdersStackParamList, 'OrderDetails'>;
};

const EventsNavigator = () => {
  return (
    <EventsStack.Navigator screenOptions={{ headerShown: false }}>
      <EventsStack.Screen name="EventsList" component={EventsListScreen} />
      <EventsStack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen as React.ComponentType<any>} 
      />
    </EventsStack.Navigator>
  );
};

const OrdersNavigator = () => {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="OrdersList" component={OrdersListScreen} />
      <OrdersStack.Screen 
        name="OrderDetails" 
        component={OrderDetailsScreen as React.ComponentType<any>} 
      />
    </OrdersStack.Navigator>
  );
};

const AdvertisingNavigator = () => {
  return (
    <AdvertisingStack.Navigator screenOptions={{ headerShown: false }}>
      <AdvertisingStack.Screen name="AdvertisingList" component={AdvertisingListScreen} />
      <AdvertisingStack.Screen name="CreateAdvertising" component={CreateAdvertisingScreen} />
      <AdvertisingStack.Screen name="AdvertisingDetails" component={AdvertisingDetailsScreen} />
      <AdvertisingStack.Screen name="SelectEvent" component={SelectEventScreen} />
    </AdvertisingStack.Navigator>
  );
};

const SalesNavigator = () => {
  return (
    <SalesStack.Navigator screenOptions={{ headerShown: false }}>
      <SalesStack.Screen name="SalesDashboard" component={SalesDashboardScreen} />
      <SalesStack.Screen name="SalesAnalytics" component={SalesAnalyticsScreen} />
      <SalesStack.Screen name="RevenueDetails" component={RevenueDetailsScreen} />
      <SalesStack.Screen name="ProductPerformance" component={ProductPerformanceScreen} />
      <SalesStack.Screen name="CustomerInsights" component={CustomerInsightsScreen} />
      <SalesStack.Screen name="SalesReports" component={SalesReportsScreen} />
    </SalesStack.Navigator>
  );
};

const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="MyEvents" component={MyEventsScreen} />
      <ProfileStack.Screen name="MessageCenter" component={MessageCenterScreen} />
      <ProfileStack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
      <ProfileStack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <ProfileStack.Screen name="Support" component={SupportScreen} />
    </ProfileStack.Navigator>
  );
};

const MainStack = () => {
  const theme = useTheme<Theme>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Events':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Orders':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Advertising':
              iconName = focused ? 'megaphone' : 'megaphone-outline';
              break;
            case 'Sales':
              iconName = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.inputBackground,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Tableau de bord' }}
      />
      <Tab.Screen 
        name="Events" 
        component={EventsNavigator}
        options={{ title: 'Événements' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersNavigator}
        options={{ title: 'Commandes' }}
      />
      <Tab.Screen 
        name="Advertising" 
        component={AdvertisingNavigator}
        options={{ title: 'Publicités' }}
      />
      <Tab.Screen 
        name="Sales" 
        component={SalesNavigator}
        options={{ title: 'Ventes' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default MainStack; 