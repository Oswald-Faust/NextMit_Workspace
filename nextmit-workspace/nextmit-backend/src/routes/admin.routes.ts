import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getEventStats,
  getPaymentStats,
} from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Protection de toutes les routes admin
router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Routes du tableau de bord
router.get('/stats/dashboard', getDashboardStats);
router.get('/stats/events', getEventStats);
router.get('/stats/payments', getPaymentStats);

// Gestion des utilisateurs
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router; 