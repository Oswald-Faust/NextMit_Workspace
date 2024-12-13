import 'dart:io';
import 'package:retry/retry.dart';
import '../utils/api_exception.dart';
import 'api_service.dart';
import 'cache_service.dart';
import 'image_compression_service.dart';
import 'upload_queue_service.dart';

class ImageUploadOrchestrator {
  final ApiService _apiService;
  final CacheService _cacheService;
  final ImageCompressionService _compressionService;
  final UploadQueueService _uploadQueue;

  static const retryOptions = RetryOptions(
    maxAttempts: 3,
    delayFactor: Duration(seconds: 2),
    maxDelay: Duration(seconds: 10),
  );

  ImageUploadOrchestrator({
    ApiService? apiService,
    CacheService? cacheService,
    ImageCompressionService? compressionService,
    UploadQueueService? uploadQueue,
  })  : _apiService = apiService ?? ApiService(),
        _cacheService = cacheService ?? CacheService(),
        _compressionService = compressionService ?? ImageCompressionService(),
        _uploadQueue = uploadQueue ?? UploadQueueService();

  Stream<UploadTask> get uploadProgress => _uploadQueue.uploadStream;

  Future<String?> uploadProfileImage(String token, String userId, File imageFile) async {
    try {
      // 1. Compression de l'image
      final compressedFile = await _compressionService.compressImage(
        imageFile,
        quality: 85,
        maxWidth: 1024,
        maxHeight: 1024,
      );

      if (compressedFile == null) {
        throw const ApiException('Erreur lors de la compression de l\'image');
      }

      // 2. Création de la tâche d'upload
      final task = UploadTask(
        id: 'profile_${DateTime.now().millisecondsSinceEpoch}',
        file: compressedFile,
        userId: userId,
        token: token,
      );

      // 3. Ajout à la file d'attente
      _uploadQueue.addToQueue(task);

      // 4. Upload avec retry
      final imageUrl = await retryOptions.retry(
        () => _apiService.uploadProfileImage(token, userId, compressedFile),
        retryIf: (e) => e is ApiException && e is! ApiUnauthorizedException,
      );

      // 5. Mise en cache de l'image
      await _cacheService.cacheImage(imageUrl, compressedFile);

      return imageUrl;
    } catch (e) {
      print('Erreur lors de l\'upload de l\'image: $e');
      rethrow;
    }
  }

  Future<File?> getProfileImage(String imageUrl) async {
    try {
      // Vérifier le cache d'abord
      final cachedFile = await _cacheService.getCachedImage(imageUrl);
      if (cachedFile != null) {
        return cachedFile;
      }

      // Si pas en cache, télécharger et mettre en cache
      final response = await retryOptions.retry(
        () => HttpClient().getUrl(Uri.parse(imageUrl)).then((request) => request.close()),
        retryIf: (e) => e is! FileSystemException,
      );

      final bytes = await response.fold<List<int>>(
        [],
        (previous, element) => previous..addAll(element),
      );

      // Compression des données téléchargées
      final compressedBytes = await _compressionService.compressImageBytes(bytes);
      if (compressedBytes == null) return null;

      // Sauvegarde temporaire
      final tempDir = await Directory.systemTemp.createTemp();
      final tempFile = File('${tempDir.path}/temp_${DateTime.now().millisecondsSinceEpoch}.jpg');
      await tempFile.writeAsBytes(compressedBytes);

      // Mise en cache
      await _cacheService.cacheImage(imageUrl, tempFile);

      return tempFile;
    } catch (e) {
      print('Erreur lors de la récupération de l\'image: $e');
      return null;
    }
  }

  Future<void> cancelUpload(String taskId) async {
    _uploadQueue.cancelUpload(taskId);
  }

  Future<void> clearCache() async {
    await _cacheService.clearCache();
  }

  void dispose() {
    _uploadQueue.dispose();
  }
} 