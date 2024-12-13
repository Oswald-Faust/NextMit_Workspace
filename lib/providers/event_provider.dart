import 'package:flutter/foundation.dart';
import '../models/event_model.dart';
import '../services/event_service.dart';

class EventProvider with ChangeNotifier {
  final EventService _eventService;
  
  List<EventModel> _events = [];
  EventModel? _selectedEvent;
  bool _isLoading = false;
  String? _error;
  bool _isConnected = false;
  int _currentPage = 1;
  bool _hasMoreEvents = true;
  
  // Filtres
  String? _searchQuery;
  EventType? _selectedType;
  EventStatus? _selectedStatus;

  EventProvider({EventService? eventService})
      : _eventService = eventService ?? EventService() {
    // Écouter les mises à jour en temps réel
    _eventService.eventStream.listen(_handleEventUpdate);
    _eventService.statusStream.listen(_handleStatusUpdate);
  }

  // Getters
  List<EventModel> get events => _events;
  EventModel? get selectedEvent => _selectedEvent;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isConnected => _isConnected;
  bool get hasMoreEvents => _hasMoreEvents;

  // Filtres
  String? get searchQuery => _searchQuery;
  EventType? get selectedType => _selectedType;
  EventStatus? get selectedStatus => _selectedStatus;

  // Vues filtrées
  List<EventModel> get upcomingEvents => 
      _events.where((e) => e.isUpcoming).toList()
        ..sort((a, b) => a.startDate.compareTo(b.startDate));

  List<EventModel> get liveEvents =>
      _events.where((e) => e.isLive).toList()
        ..sort((a, b) => a.startDate.compareTo(b.startDate));

  List<EventModel> get pastEvents =>
      _events.where((e) => e.isPast).toList()
        ..sort((a, b) => b.startDate.compareTo(a.startDate));

  // Connexion WebSocket
  Future<void> connectToEventStream(String token) async {
    try {
      await _eventService.connectToEventStream(token);
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  void _handleEventUpdate(EventModel event) {
    final index = _events.indexWhere((e) => e.id == event.id);
    if (index >= 0) {
      _events[index] = event;
    } else {
      _events.add(event);
    }
    
    if (_selectedEvent?.id == event.id) {
      _selectedEvent = event;
    }
    
    notifyListeners();
  }

  void _handleStatusUpdate(Map<String, dynamic> status) {
    _isConnected = status['status'] == 'connected';
    if (status['status'] == 'error') {
      _error = status['message'];
    }
    notifyListeners();
  }

  // CRUD Opérations
  Future<void> loadEvents({bool refresh = false}) async {
    try {
      if (refresh) {
        _currentPage = 1;
        _hasMoreEvents = true;
      }

      if (!_hasMoreEvents) return;

      _isLoading = true;
      _error = null;
      notifyListeners();

      final newEvents = await _eventService.getEvents(
        page: _currentPage,
        search: _searchQuery,
        type: _selectedType,
        status: _selectedStatus,
      );

      if (refresh) {
        _events = newEvents;
      } else {
        _events.addAll(newEvents);
      }

      _hasMoreEvents = newEvents.length == 10; // Supposant une limite de 10
      _currentPage++;
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createEvent(EventModel event, String token) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final createdEvent = await _eventService.createEvent(event, token);
      _events.add(createdEvent);
      
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> updateEvent(EventModel event, String token) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final updatedEvent = await _eventService.updateEvent(event, token);
      final index = _events.indexWhere((e) => e.id == event.id);
      
      if (index >= 0) {
        _events[index] = updatedEvent;
      }

      if (_selectedEvent?.id == event.id) {
        _selectedEvent = updatedEvent;
      }

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> deleteEvent(String eventId, String token) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _eventService.deleteEvent(eventId, token);
      _events.removeWhere((e) => e.id == eventId);
      
      if (_selectedEvent?.id == eventId) {
        _selectedEvent = null;
      }

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  // Gestion des filtres
  void setSearchQuery(String? query) {
    _searchQuery = query;
    _resetPagination();
    loadEvents(refresh: true);
  }

  void setEventType(EventType? type) {
    _selectedType = type;
    _resetPagination();
    loadEvents(refresh: true);
  }

  void setEventStatus(EventStatus? status) {
    _selectedStatus = status;
    _resetPagination();
    loadEvents(refresh: true);
  }

  void _resetPagination() {
    _currentPage = 1;
    _hasMoreEvents = true;
  }

  // Gestion de l'événement sélectionné
  void selectEvent(EventModel? event) {
    _selectedEvent = event;
    notifyListeners();
  }

  // Gestion du statut de l'événement
  Future<void> startEvent(String eventId, String token) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _eventService.startEvent(eventId, token);
      
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> endEvent(String eventId, String token) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _eventService.endEvent(eventId, token);
      
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  @override
  void dispose() {
    _eventService.dispose();
    super.dispose();
  }
} 