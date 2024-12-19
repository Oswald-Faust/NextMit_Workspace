import webpush from 'web-push';
import { User } from '../models/User';
import { config } from '../config';
import { logger } from '../utils/logger';

export class PushNotificationService {
  constructor() {
    webpush.setVapidDetails(
      'mailto:' + config.push.email,
      config.push.publicKey,
      config.push.privateKey
    );
  }

  async send(
    userId: string, 
    notification: { 
      title: string; 
      body: string; 
      data?: any;
    }
  ): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user?.pushSubscription) return;

      await webpush.sendNotification(
        user.pushSubscription,
        JSON.stringify({
          title: notification.title,
          body: notification.body,
          data: notification.data,
          icon: '/icon.png',
          badge: '/badge.png'
        })
      );
    } catch (error) {
      logger.error('Erreur d\'envoi de notification push:', error);
      if (error.statusCode === 410) {
        // Subscription expirée
        await User.findByIdAndUpdate(userId, {
          $unset: { pushSubscription: 1 }
        });
      }
    }
  }
} 