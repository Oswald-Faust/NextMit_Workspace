import { Router } from 'express';
import { auth } from '../middleware/auth';
import { AdminController } from '../controllers/admin.controller';

const router = Router();
const controller = new AdminController();

// Protéger toutes les routes admin avec le middleware auth et le rôle admin
router.use(auth(['admin']));

// Routes du dashboard
router.get('/dashboard/stats', controller.getDashboardStats);
//router.get('/dashboard/recent-activities', controller.getRecentActivities);

// Gestion des utilisateurs
router.get('/users', controller.getUsers);
router.get('/users/:userId', controller.getUser);
router.patch('/users/:userId', controller.updateUser);
router.delete('/users/:userId', controller.deleteUser);

// Gestion des événements
router.get('/events', controller.getEvents);
router.get('/events/:eventId', controller.getEvent);
router.patch('/events/:eventId', controller.updateEvent);
router.delete('/events/:eventId', controller.deleteEvent);

// Gestion des vendeurs
router.get('/vendors', controller.getVendors);
router.get('/vendors/:vendorId', controller.getVendor);
router.patch('/vendors/:vendorId', controller.updateVendor);
router.delete('/vendors/:vendorId', controller.deleteVendor);

// Gestion des stories
router.get('/stories', controller.getStories);
router.get('/stories/:storyId', controller.getStory);
router.delete('/stories/:storyId', controller.deleteStory);

// Gestion des publicités
router.get('/advertisements', controller.getAdvertisements);
router.get('/advertisements/:adId', controller.getAdvertisement);
router.patch('/advertisements/:adId', controller.updateAdvertisement);
router.delete('/advertisements/:adId', controller.deleteAdvertisement);

export default router; 