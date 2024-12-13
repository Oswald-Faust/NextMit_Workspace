import 'dart:convert';
import 'dart:io';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../utils/api_exception.dart';
import 'http_service.dart';

class AuthService {
  final HttpService _http;
  
  AuthService({required HttpService http}) : _http = http;

  Future<User> login(String email, String password) async {
    try {
      final response = await _http.post(
        '/auth/login',
        body: {
          'email': email,
          'password': password,
        },
      );

      final user = User.fromJson(response['data']['user']);
      await _saveAuthData(response['data']['token'], user);
      return user;
    } catch (e) {
      throw ApiException(e.toString());
    }
  }

  Future<void> logout() async {
    // Implémentation de la déconnexion
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  Future<User?> getCurrentUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userData = prefs.getString('user');
      if (userData != null) {
        return User.fromJson(jsonDecode(userData));
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<void> verifyEmail(String email, String code) async {
    await _http.post(
      '/auth/verify-email',
      body: {
        'email': email,
        'code': code,
      },
    );
  }

  Future<void> resendVerificationCode(String email) async {
    await _http.post(
      '/auth/resend-code',
      body: {'email': email},
    );
  }

  Future<void> register(String email, String password, String firstName, String lastName, String phone) async {
    try {
      final response = await _http.post(
        '/auth/register',
        body: {
          'email': email,
          'password': password,
          'firstName': firstName,
          'lastName': lastName,
          'phone': phone,
        },
      );
      
      if (response['success'] != true) {
        throw ApiException(response['message'] ?? 'Erreur lors de l\'inscription');
      }
    } catch (e) {
      throw ApiException(e.toString());
    }
  }

  Future<void> sendPasswordResetCode(String email) async {
    try {
      final response = await _http.post(
        '/auth/forgot-password',
        body: {'email': email},
      );
      
      if (response['success'] != true) {
        throw ApiException(response['message'] ?? 'Erreur lors de l\'envoi du code');
      }
    } catch (e) {
      throw ApiException(e.toString());
    }
  }

  Future<User> updateProfileImage(File image) async {
    try {
      // Ici, vous devrez implémenter la logique pour uploader l'image
      // Pour l'instant, on simule juste la mise à jour
      final response = await _http.post(
        '/auth/profile/image',
        body: {'imageUrl': 'temp_url'}, // À adapter selon votre API
      );
      
      return User.fromJson(response['data']['user']);
    } catch (e) {
      throw ApiException(e.toString());
    }
  }

  Future<User> deleteProfileImage() async {
    try {
      final response = await _http.post('/auth/profile/image/delete');
      return User.fromJson(response['data']['user']);
    } catch (e) {
      throw ApiException(e.toString());
    }
  }

  Future<void> _saveAuthData(String token, User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    await prefs.setString('user', jsonEncode(user.toJson()));
  }
} 