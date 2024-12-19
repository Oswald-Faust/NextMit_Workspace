import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { catchAsync } from '../utils/catchAsync';

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  getNotifications = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const notifications = await this.notificationService.getUserNotifications(
      req.user.id,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      data: notifications
    });
  });

  markAsRead = catchAsync(async (req: Request, res: Response) => {
    await this.notificationService.markAsRead(req.params.notificationId, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Notification marquée comme lue'
    });
  });

  markAllAsRead = catchAsync(async (req: Request, res: Response) => {
    await this.notificationService.markAllAsRead(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues'
    });
  });

  getUnreadCount = catchAsync(async (req: Request, res: Response) => {
    const count = await this.notificationService.getUnreadCount(req.user.id);
    res.status(200).json({
      success: true,
      data: { count }
    });
  });
} 