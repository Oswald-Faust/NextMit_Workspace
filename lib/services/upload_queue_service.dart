import 'dart:async';
import 'dart:io';
import 'package:collection/collection.dart';

enum UploadStatus {
  pending,
  inProgress,
  completed,
  failed,
  cancelled
}

class UploadTask {
  final String id;
  final File file;
  final String userId;
  final String token;
  final int retryCount;
  final DateTime createdAt;
  UploadStatus status;
  String? error;
  double progress;

  UploadTask({
    required this.id,
    required this.file,
    required this.userId,
    required this.token,
    this.retryCount = 0,
    this.status = UploadStatus.pending,
    this.error,
    this.progress = 0.0,
  }) : createdAt = DateTime.now();

  UploadTask copyWith({
    String? id,
    File? file,
    String? userId,
    String? token,
    int? retryCount,
    UploadStatus? status,
    String? error,
    double? progress,
  }) {
    return UploadTask(
      id: id ?? this.id,
      file: file ?? this.file,
      userId: userId ?? this.userId,
      token: token ?? this.token,
      retryCount: retryCount ?? this.retryCount,
      status: status ?? this.status,
      error: error ?? this.error,
      progress: progress ?? this.progress,
    );
  }
}

class UploadQueueService {
  static const int maxConcurrentUploads = 3;
  static const int maxRetries = 3;
  static const Duration retryDelay = Duration(seconds: 5);
  static const Duration timeout = Duration(minutes: 5);

  final _queue = QueueList<UploadTask>();
  final _activeUploads = <String, UploadTask>{};
  final _uploadController = StreamController<UploadTask>.broadcast();
  Timer? _processTimer;
  bool _isProcessing = false;

  Stream<UploadTask> get uploadStream => _uploadController.stream;

  void addToQueue(UploadTask task) {
    if (_queue.any((t) => t.id == task.id) || _activeUploads.containsKey(task.id)) {
      return;
    }
    _queue.add(task);
    _uploadController.add(task);
    _startProcessing();
  }

  void cancelUpload(String taskId) {
    final queueTask = _queue.firstWhereOrNull((task) => task.id == taskId);
    if (queueTask != null) {
      queueTask.status = UploadStatus.cancelled;
      _queue.remove(queueTask);
      _uploadController.add(queueTask);
    }

    final activeTask = _activeUploads[taskId];
    if (activeTask != null) {
      activeTask.status = UploadStatus.cancelled;
      _activeUploads.remove(taskId);
      _uploadController.add(activeTask);
    }
  }

  void _startProcessing() {
    if (!_isProcessing) {
      _isProcessing = true;
      _processQueue();
    }
  }

  Future<void> _processQueue() async {
    while (_queue.isNotEmpty && _activeUploads.length < maxConcurrentUploads) {
      final task = _queue.removeFirst();
      if (task.status != UploadStatus.cancelled) {
        _activeUploads[task.id] = task;
        _processUpload(task);
      }
    }

    if (_queue.isEmpty && _activeUploads.isEmpty) {
      _isProcessing = false;
    } else {
      _processTimer?.cancel();
      _processTimer = Timer(const Duration(milliseconds: 100), _processQueue);
    }
  }

  Future<void> _processUpload(UploadTask task) async {
    task.status = UploadStatus.inProgress;
    _uploadController.add(task);

    try {
      // Simuler un upload avec progression
      for (var i = 0; i <= 100; i += 10) {
        if (task.status == UploadStatus.cancelled) return;
        
        await Future.delayed(const Duration(milliseconds: 500));
        task.progress = i / 100;
        _uploadController.add(task);
      }

      task.status = UploadStatus.completed;
    } catch (e) {
      if (task.retryCount < maxRetries) {
        task.status = UploadStatus.pending;
        task.error = e.toString();
        addToQueue(task.copyWith(retryCount: task.retryCount + 1));
        await Future.delayed(retryDelay);
      } else {
        task.status = UploadStatus.failed;
        task.error = e.toString();
      }
    } finally {
      _activeUploads.remove(task.id);
      _uploadController.add(task);
      _processQueue();
    }
  }

  void dispose() {
    _processTimer?.cancel();
    _uploadController.close();
  }
} 