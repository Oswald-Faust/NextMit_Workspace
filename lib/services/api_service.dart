import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../utils/api_exception.dart';

class ApiService {
  final http.Client _client;
  final Duration _timeout;

  ApiService({
    http.Client? client,
    Duration? timeout,
  })  : _client = client ?? http.Client(),
        _timeout = timeout ?? ApiConfig.connectionTimeout;

  // Headers avec authentification
  Future<Map<String, String>> _getHeaders(String? token) async {
    return ApiConfig.getHeaders(token);
  }

  // Gestion générique des réponses
  dynamic _handleResponse(http.Response response) {
    switch (response.statusCode) {
      case ApiConfig.successCode:
      case ApiConfig.createdCode:
        return json.decode(response.body);
      case ApiConfig.badRequestCode:
        throw ApiBadRequestException(response.body);
      case ApiConfig.unauthorizedCode:
        throw ApiUnauthorizedException(response.body);
      case ApiConfig.forbiddenCode:
        throw ApiForbiddenException(response.body);
      case ApiConfig.notFoundCode:
        throw ApiNotFoundException(response.body);
      case ApiConfig.serverErrorCode:
      default:
        throw ApiServerException(response.body);
    }
  }

  // Authentification
  Future<UserModel> login(String email, String password) async {
    try {
      final response = await _client
          .post(
            Uri.parse('${ApiConfig.baseUrl}${ApiConfig.login}'),
            headers: await _getHeaders(null),
            body: json.encode({
              'email': email,
              'password': password,
            }),
          )
          .timeout(_timeout);

      final data = _handleResponse(response);
      return UserModel.fromJson(data['user']);
    } catch (e) {
      throw ApiException('Erreur lors de la connexion: $e');
    }
  }

  Future<void> register({
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    required String password,
  }) async {
    try {
      final response = await _client
          .post(
            Uri.parse('${ApiConfig.baseUrl}${ApiConfig.register}'),
            headers: await _getHeaders(null),
            body: json.encode({
              'firstName': firstName,
              'lastName': lastName,
              'email': email,
              'phone': phone,
              'password': password,
            }),
          )
          .timeout(_timeout);

      _handleResponse(response);
    } catch (e) {
      throw ApiException('Erreur lors de l\'inscription: $e');
    }
  }

  // Mise à jour du profil utilisateur
  Future<UserModel> updateUserProfile(String token, UserModel user) async {
    try {
      final response = await _client
          .put(
            Uri.parse('${ApiConfig.baseUrl}${ApiConfig.userProfile(user.id)}'),
            headers: await _getHeaders(token),
            body: json.encode(user.toJson()),
          )
          .timeout(_timeout);

      final data = _handleResponse(response);
      return UserModel.fromJson(data);
    } catch (e) {
      throw ApiException('Erreur lors de la mise à jour du profil: $e');
    }
  }

  // Upload de la photo de profil
  Future<String> uploadProfileImage(String token, String userId, File imageFile) async {
    try {
      final uri = Uri.parse('${ApiConfig.baseUrl}${ApiConfig.userProfileImage(userId)}');
      final request = http.MultipartRequest('POST', uri)
        ..headers.addAll(await _getHeaders(token))
        ..files.add(await http.MultipartFile.fromPath(
          'image',
          imageFile.path,
          filename: 'profile_${DateTime.now().millisecondsSinceEpoch}.jpg',
        ));

      final streamedResponse = await request.send().timeout(ApiConfig.uploadTimeout);
      final response = await http.Response.fromStream(streamedResponse);
      final data = _handleResponse(response);
      return data['imageUrl'];
    } catch (e) {
      throw ApiException('Erreur lors de l\'upload de l\'image: $e');
    }
  }

  // Suppression de la photo de profil
  Future<void> deleteProfileImage(String token, String userId) async {
    try {
      final response = await _client
          .delete(
            Uri.parse('${ApiConfig.baseUrl}${ApiConfig.userProfileImage(userId)}'),
            headers: await _getHeaders(token),
          )
          .timeout(_timeout);

      _handleResponse(response);
    } catch (e) {
      throw ApiException('Erreur lors de la suppression de l\'image: $e');
    }
  }

  // Réinitialisation du mot de passe
  Future<void> sendPasswordResetCode(String email) async {
    try {
      final response = await _client
          .post(
            Uri.parse('${ApiConfig.baseUrl}${ApiConfig.resetPassword}'),
            headers: await _getHeaders(null),
            body: json.encode({'email': email}),
          )
          .timeout(_timeout);

      _handleResponse(response);
    } catch (e) {
      throw ApiException('Erreur lors de l\'envoi du code de réinitialisation: $e');
    }
  }

  Future<void> resetPassword({
    required String email,
    required String code,
    required String newPassword,
  }) async {
    try {
      final response = await _client
          .post(
            Uri.parse('${ApiConfig.baseUrl}${ApiConfig.resetPassword}'),
            headers: await _getHeaders(null),
            body: json.encode({
              'email': email,
              'code': code,
              'newPassword': newPassword,
            }),
          )
          .timeout(_timeout);

      _handleResponse(response);
    } catch (e) {
      throw ApiException('Erreur lors de la réinitialisation du mot de passe: $e');
    }
  }

  void dispose() {
    _client.close();
  }
} 