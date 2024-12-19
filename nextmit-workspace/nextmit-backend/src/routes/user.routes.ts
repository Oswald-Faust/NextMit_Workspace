import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { auth } from '../middleware/auth';
import { userValidation } from '../validations/user.validation';

const router = Router();
const controller = new UserController();

router.get('/me', auth(), controller.getProfile);

router.patch(
  '/me',
  auth(),
  userValidation.updateProfile,
  controller.updateProfile
);

router.patch(
  '/me/password',
  auth(),
  userValidation.updatePassword,
  controller.updatePassword
);

router.patch(
  '/me/preferences',
  auth(),
  userValidation.updatePreferences,
  controller.updatePreferences
);

router.get('/me/stories', auth(), controller.getUserStories);
router.get('/me/orders', auth(), controller.getUserOrders);

// Routes admin
router.get(
  '/',
  auth(['admin']),
  userValidation.getUsers,
  controller.getUsers
);

router.get(
  '/:userId',
  auth(['admin']),
  userValidation.getUser,
  controller.getUser
);

router.patch(
  '/:userId',
  auth(['admin']),
  userValidation.updateUser,
  controller.updateUser
);

router.delete(
  '/:userId',
  auth(['admin']),
  userValidation.deleteUser,
  controller.deleteUser
);

export default router; 