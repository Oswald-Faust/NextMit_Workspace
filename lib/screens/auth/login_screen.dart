import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_styles.dart';
import '../../providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (_formKey.currentState!.validate()) {
      final success = await context.read<AuthProvider>().login(
        _emailController.text,
        _passwordController.text,
      );

      if (success && mounted) {
        // Vérifier si l'utilisateur est vérifié
        final user = context.read<AuthProvider>().user;
        if (user != null && !user.isVerified) {
          Navigator.pushNamed(
            context,
            '/verify-code',
            arguments: _emailController.text,
          );
        } else {
          Navigator.pushReplacementNamed(context, '/home');
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Consumer<AuthProvider>(
          builder: (context, auth, _) {
            return Stack(
              children: [
                SingleChildScrollView(
                  padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 24.h),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        SizedBox(height: 20.h),
                        Image.asset(
                          'assets/images/logo.png',
                          height: 60.h,
                        ),
                        SizedBox(height: 60.h),
                        Text(
                          'Connexion',
                          style: TextStyle(
                            color: AppColors.textPrimary,
                            fontSize: 32.sp,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'Poppins',
                          ),
                        ),
                        if (auth.error != null) ...[
                          SizedBox(height: 16.h),
                          Container(
                            padding: EdgeInsets.all(12.w),
                            decoration: BoxDecoration(
                              color: Colors.red.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8.r),
                            ),
                            child: Text(
                              auth.error!,
                              style: TextStyle(
                                color: Colors.red,
                                fontSize: 14.sp,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ],
                        SizedBox(height: 40.h),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: auth.isLoading ? null : () {
                                  // TODO: Implémenter la connexion Facebook
                                },
                                style: AppStyles.socialButtonStyle,
                                icon: Image.asset(
                                  'assets/icons/facebook.png',
                                  height: 24.h,
                                ),
                                label: const Text('Facebook'),
                              ),
                            ),
                            SizedBox(width: 16.w),
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: auth.isLoading ? null : () {
                                  // TODO: Implémenter la connexion Google
                                },
                                style: AppStyles.socialButtonStyle,
                                icon: Image.asset(
                                  'assets/icons/google.png',
                                  height: 24.h,
                                ),
                                label: const Text('Google'),
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 24.h),
                        Row(
                          children: [
                            const Expanded(
                              child: Divider(color: AppColors.divider, thickness: 1),
                            ),
                            Padding(
                              padding: EdgeInsets.symmetric(horizontal: 16.w),
                              child: Text(
                                'Or',
                                style: TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 14.sp,
                                ),
                              ),
                            ),
                            const Expanded(
                              child: Divider(color: AppColors.divider, thickness: 1),
                            ),
                          ],
                        ),
                        SizedBox(height: 24.h),
                        TextFormField(
                          controller: _emailController,
                          enabled: !auth.isLoading,
                          style: const TextStyle(color: AppColors.textPrimary),
                          decoration: AppStyles.inputDecoration.copyWith(
                            hintText: 'Email',
                            hintStyle: const TextStyle(color: AppColors.textSecondary),
                            prefixIcon: const Icon(Icons.email, color: AppColors.textSecondary),
                          ),
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Veuillez entrer votre email';
                            }
                            if (!value.contains('@')) {
                              return 'Veuillez entrer un email valide';
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 16.h),
                        TextFormField(
                          controller: _passwordController,
                          enabled: !auth.isLoading,
                          style: const TextStyle(color: AppColors.textPrimary),
                          decoration: AppStyles.inputDecoration.copyWith(
                            hintText: 'Mot de passe',
                            hintStyle: const TextStyle(color: AppColors.textSecondary),
                            prefixIcon: const Icon(Icons.lock, color: AppColors.textSecondary),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscurePassword ? Icons.visibility_off : Icons.visibility,
                                color: AppColors.textSecondary,
                              ),
                              onPressed: () {
                                setState(() {
                                  _obscurePassword = !_obscurePassword;
                                });
                              },
                            ),
                          ),
                          obscureText: _obscurePassword,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Veuillez entrer votre mot de passe';
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 16.h),
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: auth.isLoading ? null : () {
                              Navigator.pushNamed(context, '/forgot-password');
                            },
                            child: Text(
                              'Mot de passe oublié ?',
                              style: TextStyle(
                                color: AppColors.primary,
                                fontSize: 14.sp,
                              ),
                            ),
                          ),
                        ),
                        SizedBox(height: 24.h),
                        ElevatedButton(
                          onPressed: auth.isLoading ? null : _login,
                          style: AppStyles.buttonStyle,
                          child: auth.isLoading
                              ? SizedBox(
                                  height: 20.h,
                                  width: 20.w,
                                  child: const CircularProgressIndicator(
                                    valueColor: AlwaysStoppedAnimation<Color>(AppColors.white),
                                    strokeWidth: 2,
                                  ),
                                )
                              : const Text('Connexion'),
                        ),
                        SizedBox(height: 24.h),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Pas encore de compte ? ",
                              style: TextStyle(
                                color: AppColors.textSecondary,
                                fontSize: 14.sp,
                              ),
                            ),
                            TextButton(
                              onPressed: auth.isLoading ? null : () {
                                Navigator.pushNamed(context, '/register');
                              },
                              child: Text(
                                "S'inscrire",
                                style: TextStyle(
                                  color: AppColors.primary,
                                  fontSize: 14.sp,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                if (auth.isLoading)
                  Container(
                    color: Colors.black.withOpacity(0.5),
                    child: const Center(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
      ),
    );
  }
} 