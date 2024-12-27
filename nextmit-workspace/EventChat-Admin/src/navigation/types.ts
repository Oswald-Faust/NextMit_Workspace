export type ProfileStackParamList = {
  Profile: undefined;
  MyEvents: undefined;
  MessageCenter: undefined;
  MessageHistory: undefined;
  NotificationPreferences: undefined;
  AccountSettings: undefined;
  Support: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type EventsStackParamList = {
  EventsList: undefined;
  EventDetails: {
    eventId: string;
  };
};

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetails: {
    orderId: string;
  };
};

export type AdvertisingStackParamList = {
  AdvertisingList: undefined;
  CreateAdvertising: undefined;
  AdvertisingDetails: {
    adId: string;
  };
  SelectEvent: undefined;
};

export type SalesStackParamList = {
  SalesDashboard: undefined;
  SalesAnalytics: undefined;
  RevenueDetails: {
    period: string;
  };
  ProductPerformance: {
    productId: string;
  };
  CustomerInsights: undefined;
  SalesReports: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  Events: undefined;
  Orders: undefined;
  Advertising: undefined;
  Sales: undefined;
  Profile: undefined;
  Home: undefined;
  Explore: undefined;
  Favourites: undefined;
  Tickets: undefined;
};

export type RootStackParamList = AuthStackParamList & {
  Main: undefined;
};