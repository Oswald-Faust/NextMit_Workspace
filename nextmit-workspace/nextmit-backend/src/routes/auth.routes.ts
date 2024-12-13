import { Router } from 'express';
import { register, login, getMe, updateProfile, updatePassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';
import { validateRegister, validateLogin, validateUpdateProfile, validateUpdatePassword } from '../middleware/validate';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validateUpdateProfile, updateProfile);
router.put('/password', protect, validateUpdatePassword, updatePassword);

export default router; 