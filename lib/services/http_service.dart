import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../utils/api_exception.dart';

class HttpService {
  final String baseUrl;
  final http.Client _client;

  HttpService({String? baseUrl}) 
    : baseUrl = baseUrl ?? ApiConfig.baseUrl,
      _client = http.Client();

  Future<dynamic> get(String endpoint) async {
    try {
      final response = await _client.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: {'Content-Type': 'application/json'},
      );
      return _handleResponse(response);
    } catch (e) {
      throw ApiException('Erreur de connexion: $e');
    }
  }

  Future<dynamic> post(String endpoint, {Map<String, dynamic>? body}) async {
    try {
      final response = await _client.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );
      return _handleResponse(response);
    } catch (e) {
      throw ApiException('Erreur de connexion: $e');
    }
  }

  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    }

    switch (response.statusCode) {
      case 400:
        throw BadRequestException(response.body);
      case 401:
        throw UnauthorizedException();
      case 403:
        throw ApiForbiddenException();
      default:
        throw ApiException('Erreur serveur: ${response.statusCode}');
    }
  }

  void dispose() {
    _client.close();
  }
} 