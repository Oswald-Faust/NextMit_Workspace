class StatsModel {
  final int totalEvents;
  final int liveEvents;
  final int upcomingEvents;
  final int totalUsers;
  final int activeUsers;
  final double totalRevenue;
  final List<ChartData> revenueData;
  final List<ChartData> userActivityData;
  final List<EventTypeStats> eventTypeStats;

  StatsModel({
    required this.totalEvents,
    required this.liveEvents,
    required this.upcomingEvents,
    required this.totalUsers,
    required this.activeUsers,
    required this.totalRevenue,
    required this.revenueData,
    required this.userActivityData,
    required this.eventTypeStats,
  });

  factory StatsModel.fromJson(Map<String, dynamic> json) {
    return StatsModel(
      totalEvents: json['totalEvents'],
      liveEvents: json['liveEvents'],
      upcomingEvents: json['upcomingEvents'],
      totalUsers: json['totalUsers'],
      activeUsers: json['activeUsers'],
      totalRevenue: json['totalRevenue'].toDouble(),
      revenueData: (json['revenueData'] as List)
          .map((data) => ChartData.fromJson(data))
          .toList(),
      userActivityData: (json['userActivityData'] as List)
          .map((data) => ChartData.fromJson(data))
          .toList(),
      eventTypeStats: (json['eventTypeStats'] as List)
          .map((stats) => EventTypeStats.fromJson(stats))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'totalEvents': totalEvents,
      'liveEvents': liveEvents,
      'upcomingEvents': upcomingEvents,
      'totalUsers': totalUsers,
      'activeUsers': activeUsers,
      'totalRevenue': totalRevenue,
      'revenueData': revenueData.map((data) => data.toJson()).toList(),
      'userActivityData': userActivityData.map((data) => data.toJson()).toList(),
      'eventTypeStats': eventTypeStats.map((stats) => stats.toJson()).toList(),
    };
  }
}

class ChartData {
  final DateTime date;
  final double value;

  ChartData({
    required this.date,
    required this.value,
  });

  factory ChartData.fromJson(Map<String, dynamic> json) {
    return ChartData(
      date: DateTime.parse(json['date']),
      value: json['value'].toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'date': date.toIso8601String(),
      'value': value,
    };
  }
}

class EventTypeStats {
  final String type;
  final int count;
  final double revenue;
  final double percentageTotal;

  EventTypeStats({
    required this.type,
    required this.count,
    required this.revenue,
    required this.percentageTotal,
  });

  factory EventTypeStats.fromJson(Map<String, dynamic> json) {
    return EventTypeStats(
      type: json['type'],
      count: json['count'],
      revenue: json['revenue'].toDouble(),
      percentageTotal: json['percentageTotal'].toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'count': count,
      'revenue': revenue,
      'percentageTotal': percentageTotal,
    };
  }
} 