class ApiConstants {
  static const String baseUrl = 'http://10.0.2.2:5000/api/v1';
  
  // Routes d'authentification
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String getMe = '/auth/me';
  static const String updateProfile = '/auth/profile';
  static const String updatePassword = '/auth/password';

  // Routes des événements
  static const String events = '/events';
  static const String eventTickets = '/events/{id}/tickets';
  static const String bookTicket = '/events/{id}/book';

  // Routes admin
  static const String adminDashboard = '/admin/stats/dashboard';
  static const String adminUsers = '/admin/users';
  static const String adminEventStats = '/admin/stats/events';
  static const String adminPaymentStats = '/admin/stats/payments';
} 