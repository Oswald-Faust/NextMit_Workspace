import { Router } from 'express';
import { SocialController } from '../controllers/social.controller';
import { auth } from '../middleware/auth';
import { socialValidation } from '../validations/social.validation';

const router = Router();
const controller = new SocialController();

// Protection des routes
router.use(auth(['user', 'admin', 'manager']));

// Gestion des amis
router.post(
  '/friends/request/:userId',
  socialValidation.sendFriendRequest,
  controller.sendFriendRequest
);
router.get('/friends/requests', controller.getPendingFriendRequests);
router.patch(
  '/friends/request/:requestId/accept',
  socialValidation.handleFriendRequest,
  controller.acceptFriendRequest
);
router.patch(
  '/friends/request/:requestId/reject',
  socialValidation.handleFriendRequest,
  controller.rejectFriendRequest
);
router.get('/friends', controller.getFriendsList);
router.delete('/friends/:friendId', controller.removeFriend);

// Gestion des followers/following
router.post('/follow/:userId', controller.followUser);
router.delete('/unfollow/:userId', controller.unfollowUser);
router.get('/followers', controller.getFollowers);
router.get('/following', controller.getFollowing);

// Messagerie
router.post(
  '/messages/:receiverId',
  socialValidation.sendMessage,
  controller.sendMessage
);
router.get('/messages/:friendId', controller.getConversation);
router.get('/conversations', controller.getConversations);
router.patch('/messages/:messageId/read', controller.markMessageAsRead);

export default router; 