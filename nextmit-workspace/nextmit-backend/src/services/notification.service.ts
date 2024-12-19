import { User } from '../models/User';
import { Notification, INotification } from '../models/Notification';
import { WebSocketService } from './websocket.service';
import { EmailService } from './email.service';
import { PushNotificationService } from './push-notification.service';
import { ApiError } from '../utils/ApiError';

export type NotificationType = 
  | 'FRIEND_REQUEST' 
  | 'FRIEND_REQUEST_ACCEPTED' 
  | 'FRIEND_REQUEST_REJECTED'
  | 'NEW_MESSAGE'
  | 'NEW_FOLLOWER'
  | 'NEW_STORY'
  | 'EVENT_REMINDER'
  | 'SYSTEM';

export class NotificationService {
  constructor(
    private webSocketService: WebSocketService,
    private emailService: EmailService,
    private pushNotificationService: PushNotificationService
  ) {}

  async notify(
    userId: string,
    type: NotificationType,
    message: string,
    data?: any
  ): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    // Créer la notification
    const notification = await Notification.create({
      user: userId,
      type,
      message,
      data,
      read: false
    });

    // Envoyer via WebSocket si l'utilisateur est connecté
    this.webSocketService.sendToUser(userId, 'notification', notification);

    // Envoyer des notifications push si activées
    if (user.preferences.notifications.push) {
      await this.pushNotificationService.send(userId, {
        title: this.getNotificationTitle(type),
        body: message,
        data: { type, ...data }
      });
    }

    // Envoyer un email si activé
    if (user.preferences.notifications.email) {
      await this.emailService.sendNotificationEmail(user.email, {
        type,
        message,
        data
      });
    }
  }

  async notifyMany(
    userIds: string[],
    type: NotificationType,
    message: string,
    data?: any
  ): Promise<void> {
    await Promise.all(
      userIds.map(userId => this.notify(userId, type, message, data))
    );
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      throw new ApiError(404, 'Notification non trouvée');
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({
      user: userId,
      read: false
    });
  }

  private getNotificationTitle(type: NotificationType): string {
    const titles = {
      FRIEND_REQUEST: 'Nouvelle demande d\'ami',
      FRIEND_REQUEST_ACCEPTED: 'Demande d\'ami acceptée',
      FRIEND_REQUEST_REJECTED: 'Demande d\'ami rejetée',
      NEW_MESSAGE: 'Nouveau message',
      NEW_FOLLOWER: 'Nouvel abonné',
      NEW_STORY: 'Nouvelle story',
      EVENT_REMINDER: 'Rappel d\'événement',
      SYSTEM: 'Notification système'
    };
    return titles[type] || 'Nextmit';
  }
} 