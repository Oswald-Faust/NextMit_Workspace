class ApiConfig {
  static const String baseUrl = 'http://10.0.2.2:5000/api/v1'; // Pour l'émulateur Android
  // static const String baseUrl = 'http://localhost:5000/api/v1'; // Pour iOS
  
  // Routes d'authentification
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String verifyEmail = '/auth/verify-email';
  static const String resetPassword = '/auth/reset-password';
  static const String updateProfile = '/auth/profile';
} 