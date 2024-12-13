class ApiException implements Exception {
  final String message;
  final int statusCode;

  const ApiException(this.message, {this.statusCode = 500});

  @override
  String toString() => message;
}

class UnauthorizedException extends ApiException {
  UnauthorizedException([super.message = 'Non autorisé']) 
      : super(statusCode: 401);
}

class BadRequestException extends ApiException {
  BadRequestException([super.message = 'Requête invalide']) 
      : super(statusCode: 400);
}

class ApiForbiddenException extends ApiException {
  ApiForbiddenException([super.message = 'Accès interdit']) 
      : super(statusCode: 403);
}

class NotFoundException extends ApiException {
  NotFoundException([super.message = 'Ressource non trouvée']) 
      : super(statusCode: 404);
}

class ServerException extends ApiException {
  ServerException([super.message = 'Erreur serveur']) 
      : super(statusCode: 500);
} 