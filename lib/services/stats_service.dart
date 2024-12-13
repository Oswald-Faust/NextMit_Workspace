import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/stats_model.dart';
import '../utils/api_exception.dart';

class StatsService {
  final http.Client _client;

  StatsService({http.Client? client}) : _client = client ?? http.Client();

  Future<StatsModel> getStats(String token) async {
    try {
      final response = await _client
          .get(
            Uri.parse('${ApiConfig.baseUrl}/admin/stats'),
            headers: ApiConfig.getHeaders(token),
          )
          .timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == ApiConfig.successCode) {
        return StatsModel.fromJson(json.decode(response.body));
      }

      throw const ApiException('Erreur lors de la récupération des statistiques');
    } catch (e) {
      throw ApiException('Erreur lors de la récupération des statistiques: $e');
    }
  }

  Future<Map<String, dynamic>> getEventStats(String eventId, String token) async {
    try {
      final response = await _client
          .get(
            Uri.parse('${ApiConfig.baseUrl}/admin/events/$eventId/stats'),
            headers: ApiConfig.getHeaders(token),
          )
          .timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == ApiConfig.successCode) {
        return json.decode(response.body);
      }

      throw const ApiException('Erreur lors de la récupération des statistiques de l\'événement');
    } catch (e) {
      throw ApiException('Erreur lors de la récupération des statistiques de l\'événement: $e');
    }
  }

  Future<Map<String, dynamic>> getRevenueStats({
    required String token,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    try {
      final queryParams = {
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
      };

      final response = await _client
          .get(
            Uri.parse('${ApiConfig.baseUrl}/admin/stats/revenue')
                .replace(queryParameters: queryParams),
            headers: ApiConfig.getHeaders(token),
          )
          .timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == ApiConfig.successCode) {
        return json.decode(response.body);
      }

      throw const ApiException('Erreur lors de la récupération des statistiques de revenus');
    } catch (e) {
      throw ApiException('Erreur lors de la récupération des statistiques de revenus: $e');
    }
  }

  Future<Map<String, dynamic>> getUserStats({
    required String token,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    try {
      final queryParams = {
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
      };

      final response = await _client
          .get(
            Uri.parse('${ApiConfig.baseUrl}/admin/stats/users')
                .replace(queryParameters: queryParams),
            headers: ApiConfig.getHeaders(token),
          )
          .timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == ApiConfig.successCode) {
        return json.decode(response.body);
      }

      throw const ApiException('Erreur lors de la récupération des statistiques utilisateurs');
    } catch (e) {
      throw ApiException('Erreur lors de la récupération des statistiques utilisateurs: $e');
    }
  }

  void dispose() {
    _client.close();
  }
} 