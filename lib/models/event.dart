class Event {
  final String id;
  final String name;
  final String description;
  final String type;
  final String location;
  final DateTime startDate;
  final DateTime endDate;
  final List<TicketType> tickets;
  final String imageUrl;
  final String status;
  final String organizerId;
  final int capacity;

  Event({
    required this.id,
    required this.name,
    required this.description,
    required this.type,
    required this.location,
    required this.startDate,
    required this.endDate,
    required this.tickets,
    required this.imageUrl,
    required this.status,
    required this.organizerId,
    required this.capacity,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['_id'],
      name: json['name'],
      description: json['description'],
      type: json['type'],
      location: json['location'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      tickets: (json['tickets'] as List)
          .map((ticket) => TicketType.fromJson(ticket))
          .toList(),
      imageUrl: json['imageUrl'],
      status: json['status'],
      organizerId: json['organizer'],
      capacity: json['capacity'],
    );
  }
}

class TicketType {
  final String type;
  final double price;
  final int quantity;
  final int sold;

  TicketType({
    required this.type,
    required this.price,
    required this.quantity,
    required this.sold,
  });

  factory TicketType.fromJson(Map<String, dynamic> json) {
    return TicketType(
      type: json['type'],
      price: json['price'].toDouble(),
      quantity: json['quantity'],
      sold: json['sold'],
    );
  }
} 