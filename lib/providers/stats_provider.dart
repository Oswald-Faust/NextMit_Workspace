import 'package:flutter/foundation.dart';
import '../models/stats_model.dart';
import '../services/stats_service.dart';

class StatsProvider with ChangeNotifier {
  final StatsService _statsService;
  
  StatsModel? _stats;
  Map<String, dynamic>? _eventStats;
  Map<String, dynamic>? _revenueStats;
  Map<String, dynamic>? _userStats;
  bool _isLoading = false;
  String? _error;

  DateTime _startDate = DateTime.now().subtract(const Duration(days: 30));
  DateTime _endDate = DateTime.now();

  StatsProvider({StatsService? statsService})
      : _statsService = statsService ?? StatsService();

  // Getters
  StatsModel? get stats => _stats;
  Map<String, dynamic>? get eventStats => _eventStats;
  Map<String, dynamic>? get revenueStats => _revenueStats;
  Map<String, dynamic>? get userStats => _userStats;
  bool get isLoading => _isLoading;
  String? get error => _error;
  DateTime get startDate => _startDate;
  DateTime get endDate => _endDate;

  // Setters pour la période
  void setDateRange(DateTime start, DateTime end) {
    _startDate = start;
    _endDate = end;
    notifyListeners();
    refreshStats();
  }

  // Récupération des statistiques générales
  Future<void> loadStats(String token) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      _stats = await _statsService.getStats(token);

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Récupération des statistiques d'un événement spécifique
  Future<void> loadEventStats(String eventId, String token) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      _eventStats = await _statsService.getEventStats(eventId, token);

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Récupération des statistiques de revenus
  Future<void> loadRevenueStats(String token) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      _revenueStats = await _statsService.getRevenueStats(
        token: token,
        startDate: _startDate,
        endDate: _endDate,
      );

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Récupération des statistiques utilisateurs
  Future<void> loadUserStats(String token) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      _userStats = await _statsService.getUserStats(
        token: token,
        startDate: _startDate,
        endDate: _endDate,
      );

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Rafraîchissement de toutes les statistiques
  Future<void> refreshStats() async {
    if (_isLoading) return;

    const token = 'YOUR_TOKEN'; // À remplacer par le vrai token
    await Future.wait([
      loadStats(token),
      loadRevenueStats(token),
      loadUserStats(token),
    ]);
  }

  @override
  void dispose() {
    _statsService.dispose();
    super.dispose();
  }
} 