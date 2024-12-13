import 'dart:io';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'dart:typed_data';

class ImageCompressionService {
  static const int defaultQuality = 85;
  static const int defaultMaxWidth = 1024;
  static const int defaultMaxHeight = 1024;

  Future<File?> compressImage(
    File file, {
    int quality = defaultQuality,
    int maxWidth = defaultMaxWidth,
    int maxHeight = defaultMaxHeight,
  }) async {
    try {
      final dir = await getTemporaryDirectory();
      final targetPath = path.join(
        dir.path,
        'compressed_${DateTime.now().millisecondsSinceEpoch}${path.extension(file.path)}',
      );

      final result = await FlutterImageCompress.compressAndGetFile(
        file.absolute.path,
        targetPath,
        quality: quality,
        minWidth: maxWidth,
        minHeight: maxHeight,
        rotate: 0,
      );

      if (result != null) {
        // Vérifier si la compression a effectivement réduit la taille
        final originalSize = await file.length();
        final compressedSize = await result.length();

        if (compressedSize < originalSize) {
          return File(result.path);
        } else {
          // Si la compression n'a pas réduit la taille, retourner le fichier original
          await File(result.path).delete();
          return file;
        }
      }
      return null;
    } catch (e) {
      print('Erreur lors de la compression de l\'image: $e');
      return null;
    }
  }

  Future<List<int>?> compressImageBytes(
    List<int> imageBytes, {
    int quality = defaultQuality,
    int maxWidth = defaultMaxWidth,
    int maxHeight = defaultMaxHeight,
  }) async {
    try {
      Uint8List uint8List = Uint8List.fromList(imageBytes);
      final result = await FlutterImageCompress.compressWithList(
        uint8List,
        quality: quality,
        minWidth: maxWidth,
        minHeight: maxHeight,
        rotate: 0,
      );

      if (result.length < imageBytes.length) {
        return result;
      }
      return imageBytes;
    } catch (e) {
      print('Erreur lors de la compression des bytes de l\'image: $e');
      return null;
    }
  }
} 