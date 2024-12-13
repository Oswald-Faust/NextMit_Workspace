import 'package:flutter/material.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/auth/verify_code_screen.dart';
import '../screens/events/events_screen.dart';
import '../screens/profile/profile_screen.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
      case '/login':
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      
      case '/register':
        return MaterialPageRoute(builder: (_) => const RegisterScreen());
      
      case '/verify-code':
        final email = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => const VerifyCodeScreen(),
          settings: settings,
        );
      
      case '/home':
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      
      case '/events':
        return MaterialPageRoute(builder: (_) => const EventsScreen());
      
      case '/profile':
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('Route inconnue: ${settings.name}'),
            ),
          ),
        );
    }
  }
} 