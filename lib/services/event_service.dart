import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:web_socket_channel/web_socket_channel.dart';
import '../config/api_config.dart';
import '../models/event_model.dart';
import '../utils/api_exception.dart';
import '../models/event.dart';
import '../config/api_constants.dart';
import 'http_service.dart';

class EventService {
  final http.Client _client;
  WebSocketChannel? _channel;
  final _eventController = StreamController<EventModel>.broadcast();
  final _statusController = StreamController<Map<String, dynamic>>.broadcast();
  Timer? _heartbeatTimer;
  Timer? _reconnectTimer;
  bool _isConnected = false;
  final HttpService _http;

  EventService({http.Client? client, required HttpService http}) : _client = client ?? http.Client(), _http = http;

  Stream<EventModel> get eventStream => _eventController.stream;
  Stream<Map<String, dynamic>> get statusStream => _statusController.stream;
  bool get isConnected => _isConnected;

  // Connexion WebSocket
  Future<void> connectToEventStream(String token) async {
    try {
      final wsUrl = Uri.parse('${ApiConfig.baseUrl.replaceFirst('http', 'ws')}/events/stream');
      _channel = WebSocketChannel.connect(wsUrl, protocols: ['bearer', token]);
      
      _channel!.stream.listen(
        (data) => _handleWebSocketMessage(data),
        onError: (error) => _handleWebSocketError(error),
        onDone: () => _handleWebSocketDone(),
        cancelOnError: false,
      );

      _startHeartbeat();
      _isConnected = true;
      _statusController.add({'status': 'connected'});
    } catch (e) {
      _handleWebSocketError(e);
    }
  }

  void _startHeartbeat() {
    _heartbeatTimer?.cancel();
    _heartbeatTimer = Timer.periodic(
      const Duration(seconds: 30),
      (_) => _channel?.sink.add(json.encode({'type': 'ping'})),
    );
  }

  void _handleWebSocketMessage(dynamic data) {
    try {
      final message = json.decode(data);
      
      switch (message['type']) {
        case 'event_update':
          final event = EventModel.fromJson(message['data']);
          _eventController.add(event);
          break;
        case 'pong':
          // Heartbeat response
          break;
        case 'error':
          _statusController.add({
            'status': 'error',
            'message': message['message'],
          });
          break;
      }
    } catch (e) {
      print('Erreur lors du traitement du message WebSocket: $e');
    }
  }

  void _handleWebSocketError(dynamic error) {
    _isConnected = false;
    _statusController.add({
      'status': 'error',
      'message': error.toString(),
    });
    _scheduleReconnect();
  }

  void _handleWebSocketDone() {
    _isConnected = false;
    _statusController.add({'status': 'disconnected'});
    _scheduleReconnect();
  }

  void _scheduleReconnect() {
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(const Duration(seconds: 5), () {
      if (!_isConnected) {
        connectToEventStream(_channel?.protocol ?? '');
      }
    });
  }

  // CRUD Opérations
  Future<List<EventModel>> getEvents({
    String? searchQuery,
    EventType? type,
    EventStatus? status,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final queryParams = {
        'page': page.toString(),
        'limit': limit.toString(),
        if (searchQuery != null) 'search': searchQuery,
        if (type != null) 'type': type.toString().split('.').last,
        if (status != null) 'status': status.toString().split('.').last,
      };

      final response = await _client
          .get(
            Uri.parse('${ApiConfig.baseUrl}${ApiConfig.events}')
                .replace(queryParameters: queryParams),
          )
          .timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == ApiConfig.successCode) {
        final List<dynamic> data = json.decode(response.body)['events'];
        return data.map((json) => EventModel.fromJson(json)).toList();
      }

      throw const ApiException('Erreur lors de la récupération des événements');
    } catch (e) {
      throw ApiException('Erreur lors de la récupération des événements: $e');
    }
  }

  Future<EventModel> createEvent(EventModel event, String token) async {
    try {
      final response = await _client
          .post(
            Uri.parse('${ApiConfig.baseUrl}${ApiConfig.events}'),
            headers: ApiConfig.getHeaders(token),
            body: json.encode(event.toJson()),
          )
          .timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == ApiConfig.createdCode) {
        return EventModel.fromJson(json.decode(response.body));
      }

      throw const ApiException('Erreur lors de la création de l\'événement');
    } catch (e) {
      throw ApiException('Erreur lors de la création de l\'événement: $e');
    }
  }

  Future<EventModel> updateEvent(EventModel event, String token) async {
    try {
      final response = await _client
          .put(
            Uri.parse('${ApiConfig.baseUrl}${ApiConfig.eventDetails(event.id)}'),
            headers: ApiConfig.getHeaders(token),
            body: json.encode(event.toJson()),
          )
          .timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == ApiConfig.successCode) {
        return EventModel.fromJson(json.decode(response.body));
      }

      throw const ApiException('Erreur lors de la mise à jour de l\'événement');
    } catch (e) {
      throw ApiException('Erreur lors de la mise à jour de l\'événement: $e');
    }
  }

  Future<void> deleteEvent(String eventId, String token) async {
    try {
      final response = await _client
          .delete(
            Uri.parse('${ApiConfig.baseUrl}${ApiConfig.eventDetails(eventId)}'),
            headers: ApiConfig.getHeaders(token),
          )
          .timeout(ApiConfig.connectionTimeout);

      if (response.statusCode != ApiConfig.successCode) {
        throw const ApiException('Erreur lors de la suppression de l\'événement');
      }
    } catch (e) {
      throw ApiException('Erreur lors de la suppression de l\'événement: $e');
    }
  }

  // Gestion du statut de l'événement
  Future<void> startEvent(String eventId, String token) async {
    try {
      final response = await _client
          .post(
            Uri.parse('${ApiConfig.baseUrl}${ApiConfig.eventDetails(eventId)}/start'),
            headers: ApiConfig.getHeaders(token),
          )
          .timeout(ApiConfig.connectionTimeout);

      if (response.statusCode != ApiConfig.successCode) {
        throw const ApiException('Erreur lors du démarrage de l\'événement');
      }
    } catch (e) {
      throw ApiException('Erreur lors du démarrage de l\'événement: $e');
    }
  }

  Future<void> endEvent(String eventId, String token) async {
    try {
      final response = await _client
          .post(
            Uri.parse('${ApiConfig.baseUrl}${ApiConfig.eventDetails(eventId)}/end'),
            headers: ApiConfig.getHeaders(token),
          )
          .timeout(ApiConfig.connectionTimeout);

      if (response.statusCode != ApiConfig.successCode) {
        throw const ApiException('Erreur lors de la fin de l\'événement');
      }
    } catch (e) {
      throw ApiException('Erreur lors de la fin de l\'événement: $e');
    }
  }

  Future<List<Event>> getEvents({
    int page = 1,
    int limit = 10,
    String? searchQuery,
    String? eventType,
    String? status,
  }) async {
    final queryParams = {
      'page': page.toString(),
      'limit': limit.toString(),
      if (searchQuery != null) 'search': searchQuery,
      if (eventType != null) 'type': eventType,
      if (status != null) 'status': status,
    };

    final response = await _http.get(
      '${ApiConstants.events}?${Uri(queryParameters: queryParams).query}'
    );

    return (response['data']['items'] as List)
        .map((item) => Event.fromJson(item))
        .toList();
  }

  Future<Event> getEventDetails(String eventId) async {
    final response = await _http.get('${ApiConstants.events}/$eventId');
    return Event.fromJson(response['data']);
  }

  Future<List<Ticket>> getEventTickets(String eventId) async {
    final response = await _http.get(
      ApiConstants.eventTickets.replaceAll('{id}', eventId)
    );

    return (response['data'] as List)
        .map((item) => Ticket.fromJson(item))
        .toList();
  }

  void dispose() {
    _heartbeatTimer?.cancel();
    _reconnectTimer?.cancel();
    _channel?.sink.close();
    _eventController.close();
    _statusController.close();
    _client.close();
  }
} 