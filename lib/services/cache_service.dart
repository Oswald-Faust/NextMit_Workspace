import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'package:crypto/crypto.dart';
import 'dart:convert';

class CacheService {
  static const String _cacheDir = 'image_cache';
  static const int _maxCacheSize = 100 * 1024 * 1024; // 100 MB
  static const Duration _maxAge = Duration(days: 7);

  Future<String> getCachePath() async {
    final appDir = await getApplicationDocumentsDirectory();
    final cacheDir = Directory(path.join(appDir.path, _cacheDir));
    if (!await cacheDir.exists()) {
      await cacheDir.create(recursive: true);
    }
    return cacheDir.path;
  }

  Future<String> getCacheKey(String url) async {
    final bytes = utf8.encode(url);
    final hash = sha256.convert(bytes);
    return hash.toString();
  }

  Future<File?> getCachedImage(String url) async {
    try {
      final cacheKey = await getCacheKey(url);
      final cachePath = await getCachePath();
      final file = File(path.join(cachePath, cacheKey));

      if (await file.exists()) {
        final stat = await file.stat();
        final age = DateTime.now().difference(stat.modified);

        if (age > _maxAge) {
          await file.delete();
          return null;
        }

        return file;
      }
      return null;
    } catch (e) {
      print('Erreur lors de la récupération du cache: $e');
      return null;
    }
  }

  Future<void> cacheImage(String url, File imageFile) async {
    try {
      final cacheKey = await getCacheKey(url);
      final cachePath = await getCachePath();
      final file = File(path.join(cachePath, cacheKey));

      // Copier l'image dans le cache
      await imageFile.copy(file.path);

      // Nettoyer le cache si nécessaire
      await _cleanCache();
    } catch (e) {
      print('Erreur lors de la mise en cache: $e');
    }
  }

  Future<void> _cleanCache() async {
    try {
      final cachePath = await getCachePath();
      final cacheDir = Directory(cachePath);
      int totalSize = 0;

      final files = await cacheDir.list().toList();
      files.sort((a, b) => a.statSync().modified.compareTo(b.statSync().modified));

      for (var entity in files) {
        if (entity is File) {
          final stat = await entity.stat();
          totalSize += stat.size;

          // Supprimer les fichiers les plus anciens si le cache dépasse la taille maximale
          if (totalSize > _maxCacheSize) {
            await entity.delete();
          }
        }
      }
    } catch (e) {
      print('Erreur lors du nettoyage du cache: $e');
    }
  }

  Future<void> clearCache() async {
    try {
      final cachePath = await getCachePath();
      final cacheDir = Directory(cachePath);
      if (await cacheDir.exists()) {
        await cacheDir.delete(recursive: true);
      }
    } catch (e) {
      print('Erreur lors de la suppression du cache: $e');
    }
  }
} 