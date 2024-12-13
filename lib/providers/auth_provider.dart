import 'dart:io';
import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';
import '../utils/api_exception.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService;
  
  User? _user;
  bool _isLoading = false;
  String? _error;

  AuthProvider({required AuthService authService}) : _authService = authService;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  Future<bool> login(String email, String password) async {
    try {
      _setLoading(true);
      _user = await _authService.login(email, password);
      return true;
    } catch (e) {
      _handleError(e);
      return false;
    }
  }

  Future<bool> register(String email, String password, String firstName, String lastName, String phone) async {
    try {
      _setLoading(true);
      await _authService.register(email, password, firstName, lastName, phone);
      return true;
    } catch (e) {
      _handleError(e);
      return false;
    }
  }

  Future<bool> verifyEmail(String email, String code) async {
    try {
      _setLoading(true);
      await _authService.verifyEmail(email, code);
      return true;
    } catch (e) {
      _handleError(e);
      return false;
    }
  }

  Future<bool> resendVerificationCode(String email) async {
    try {
      _setLoading(true);
      await _authService.resendVerificationCode(email);
      return true;
    } catch (e) {
      _handleError(e);
      return false;
    }
  }

  Future<bool> sendPasswordResetCode(String email) async {
    try {
      _setLoading(true);
      await _authService.sendPasswordResetCode(email);
      return true;
    } catch (e) {
      _handleError(e);
      return false;
    }
  }

  Future<bool> updateProfileImage(File image) async {
    try {
      _setLoading(true);
      final updatedUser = await _authService.updateProfileImage(image);
      _user = updatedUser;
      return true;
    } catch (e) {
      _handleError(e);
      return false;
    }
  }

  Future<bool> deleteProfileImage() async {
    try {
      _setLoading(true);
      final updatedUser = await _authService.deleteProfileImage();
      _user = updatedUser;
      return true;
    } catch (e) {
      _handleError(e);
      return false;
    }
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    _error = null;
    notifyListeners();
  }

  void _handleError(dynamic e) {
    _error = e is ApiException ? e.message : e.toString();
    _isLoading = false;
    notifyListeners();
  }
} 