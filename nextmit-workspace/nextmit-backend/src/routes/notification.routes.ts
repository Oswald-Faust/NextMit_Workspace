import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { auth } from '../middleware/auth';

const router = Router();
const controller = new NotificationController(
  // Injecter le service de notification
);

router.use(auth());

router.get('/', controller.getNotifications);
router.get('/unread/count', controller.getUnreadCount);
router.patch('/:notificationId/read', controller.markAsRead);
router.patch('/read-all', controller.markAllAsRead);

export default router; 