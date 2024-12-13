import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import 'screens/onboarding/onboarding_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/auth/verify_code_screen.dart';
import 'screens/auth/forgot_password_screen.dart';
import 'screens/main/live_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'constants/app_colors.dart';
import 'providers/auth_provider.dart';
import 'services/auth_service.dart';
import 'services/http_service.dart';

void main() {
  runApp(const NextmitApp());
}

class NextmitApp extends StatelessWidget {
  const NextmitApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(375, 812),
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        final httpService = HttpService();
        final authService = AuthService(http: httpService);
        
        return MultiProvider(
          providers: [
            ChangeNotifierProvider(
              create: (_) => AuthProvider(authService: authService),
            ),
          ],
          child: MaterialApp(
            title: 'Nextmit',
            debugShowCheckedModeBanner: false,
            theme: ThemeData(
              colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primary),
              scaffoldBackgroundColor: AppColors.background,
              useMaterial3: true,
              fontFamily: 'Poppins',
            ),
            initialRoute: '/',
            routes: {
              '/': (context) => const OnboardingScreen(),
              '/live': (context) => const LiveScreen(),
              '/login': (context) => const LoginScreen(),
              '/register': (context) => const RegisterScreen(),
              '/verify-code': (context) => const VerifyCodeScreen(),
              '/forgot-password': (context) => const ForgotPasswordScreen(),
              '/profile': (context) => const ProfileScreen(),
            },
          ),
        );
      },
    );
  }
}