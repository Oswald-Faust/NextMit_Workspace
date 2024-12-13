class Ticket {
  final String id;
  final String eventId;
  final String userId;
  final String type;
  final double price;
  final int quantity;
  final String status;
  final String? qrCode;
  final DateTime createdAt;

  Ticket({
    required this.id,
    required this.eventId,
    required this.userId,
    required this.type,
    required this.price,
    required this.quantity,
    required this.status,
    this.qrCode,
    required this.createdAt,
  });

  factory Ticket.fromJson(Map<String, dynamic> json) {
    return Ticket(
      id: json['_id'],
      eventId: json['event'],
      userId: json['user'],
      type: json['type'],
      price: json['price'].toDouble(),
      quantity: json['quantity'],
      status: json['status'],
      qrCode: json['qrCode'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
} 