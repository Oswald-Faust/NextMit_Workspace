import { Router } from 'express';
import { auth } from '../middleware/auth';
import { AdminController } from '../controllers/admin.controller';
import { EventController } from '../controllers/event.controller';
import multer from 'multer';
import { userValidation } from '../validations/user.validation';

const router = Router();
const adminController = new AdminController();
const eventController = new EventController();

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Protéger toutes les routes admin avec le middleware auth et le rôle admin

// Routes du dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);
//router.get('/dashboard/recent-activities', adminController.getRecentActivities);

// Gestion des utilisateurs
router.get('/users', adminController.getUsers);
router.post('/users', userValidation.createUser, adminController.createUser);
router.get('/users/:userId', adminController.getUser);
router.patch('/users/:userId', userValidation.updateUser, adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);

// Gestion des événements
router.post('/events', upload.single('image'), eventController.createEvent);
router.get('/events', eventController.getEvents);
router.get('/events/:eventId', eventController.getEvent);
router.patch('/events/:eventId', upload.single('image'), eventController.updateEvent);
router.delete('/events/:eventId', eventController.deleteEvent);

// Gestion des vendeurs
router.get('/vendors', adminController.getVendors);
router.get('/vendors/:vendorId', adminController.getVendor);
router.patch('/vendors/:vendorId', adminController.updateVendor);
router.delete('/vendors/:vendorId', adminController.deleteVendor);

// Gestion des stories
router.get('/stories', adminController.getStories);
router.get('/stories/:storyId', adminController.getStory);
router.delete('/stories/:storyId', adminController.deleteStory);

// Gestion des publicités
router.get('/advertisements', adminController.getAdvertisements);
router.get('/advertisements/:adId', adminController.getAdvertisement);
router.patch('/advertisements/:adId', adminController.updateAdvertisement);
router.delete('/advertisements/:adId', adminController.deleteAdvertisement);

export default router;