import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate-request';
import { authValidation } from '../validations/auth.validation';

const router = Router();
const controller = new AuthController();

router.post(
  '/register',
  validateRequest(authValidation.register),
  controller.register
);

router.post(
  '/login',
  validateRequest(authValidation.login),
  controller.login
);

router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshToken),
  controller.refreshToken
);

router.post('/logout', controller.logout);

router.post(
  '/forgot-password',
  validateRequest(authValidation.forgotPassword),
  controller.forgotPassword
);

router.post(
  '/reset-password',
  validateRequest(authValidation.resetPassword),
  controller.resetPassword
);

router.post(
  '/verify-email',
  validateRequest(authValidation.verifyEmail),
  controller.verifyEmail
);

export default router; 