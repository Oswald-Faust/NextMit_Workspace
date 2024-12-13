import 'package:flutter/material.dart';
import '../utils/api_exception.dart';

class ErrorHandler {
  static String handleError(dynamic error) {
    if (error is UnauthorizedException) {
      return 'Session expirée. Veuillez vous reconnecter.';
    } else if (error is BadRequestException) {
      return error.message;
    } else if (error is ApiException) {
      return error.message;
    } else {
      return 'Une erreur inattendue s\'est produite';
    }
  }

  static void showErrorSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
} 