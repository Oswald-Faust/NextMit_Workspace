
enum EventStatus {
  draft,
  scheduled,
  live,
  completed,
  cancelled
}

enum EventType {
  concert,
  festival,
  conference,
  workshop,
  other
}

class EventModel {
  final String id;
  final String title;
  final String description;
  final DateTime startDate;
  final DateTime endDate;
  final String location;
  final String? coverImage;
  final double price;
  final int maxAttendees;
  final int currentAttendees;
  final EventStatus status;
  final EventType type;
  final bool isPublic;
  final bool chatEnabled;
  final String organizerId;
  final List<String> tags;
  final Map<String, dynamic> settings;
  final DateTime createdAt;
  final DateTime updatedAt;

  EventModel({
    required this.id,
    required this.title,
    required this.description,
    required this.startDate,
    required this.endDate,
    required this.location,
    this.coverImage,
    required this.price,
    required this.maxAttendees,
    required this.currentAttendees,
    required this.status,
    required this.type,
    required this.isPublic,
    required this.chatEnabled,
    required this.organizerId,
    required this.tags,
    required this.settings,
    required this.createdAt,
    required this.updatedAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'location': location,
      'coverImage': coverImage,
      'price': price,
      'maxAttendees': maxAttendees,
      'currentAttendees': currentAttendees,
      'status': status.toString().split('.').last,
      'type': type.toString().split('.').last,
      'isPublic': isPublic,
      'chatEnabled': chatEnabled,
      'organizerId': organizerId,
      'tags': tags,
      'settings': settings,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  factory EventModel.fromJson(Map<String, dynamic> json) {
    return EventModel(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      location: json['location'],
      coverImage: json['coverImage'],
      price: json['price'].toDouble(),
      maxAttendees: json['maxAttendees'],
      currentAttendees: json['currentAttendees'],
      status: EventStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
      ),
      type: EventType.values.firstWhere(
        (e) => e.toString().split('.').last == json['type'],
      ),
      isPublic: json['isPublic'],
      chatEnabled: json['chatEnabled'],
      organizerId: json['organizerId'],
      tags: List<String>.from(json['tags']),
      settings: json['settings'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  EventModel copyWith({
    String? id,
    String? title,
    String? description,
    DateTime? startDate,
    DateTime? endDate,
    String? location,
    String? coverImage,
    double? price,
    int? maxAttendees,
    int? currentAttendees,
    EventStatus? status,
    EventType? type,
    bool? isPublic,
    bool? chatEnabled,
    String? organizerId,
    List<String>? tags,
    Map<String, dynamic>? settings,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return EventModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      location: location ?? this.location,
      coverImage: coverImage ?? this.coverImage,
      price: price ?? this.price,
      maxAttendees: maxAttendees ?? this.maxAttendees,
      currentAttendees: currentAttendees ?? this.currentAttendees,
      status: status ?? this.status,
      type: type ?? this.type,
      isPublic: isPublic ?? this.isPublic,
      chatEnabled: chatEnabled ?? this.chatEnabled,
      organizerId: organizerId ?? this.organizerId,
      tags: tags ?? this.tags,
      settings: settings ?? this.settings,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  bool get isLive => status == EventStatus.live;
  bool get isUpcoming => status == EventStatus.scheduled && startDate.isAfter(DateTime.now());
  bool get isPast => status == EventStatus.completed || endDate.isBefore(DateTime.now());
  bool get isCancelled => status == EventStatus.cancelled;
  bool get isFull => currentAttendees >= maxAttendees;
  
  Duration get duration => endDate.difference(startDate);
  bool get isMultiDay => startDate.day != endDate.day;
  
  String get formattedPrice => price == 0 ? 'Gratuit' : '${price.toStringAsFixed(2)}€';
  String get availableSpots => isFull ? 'Complet' : '${maxAttendees - currentAttendees} places disponibles';
} 