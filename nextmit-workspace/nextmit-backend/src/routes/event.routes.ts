import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { auth } from '../middleware/auth';
import { eventValidation } from '../validations/event.validation';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new EventController();

// Routes publiques
router.get('/', eventValidation.getEvents, controller.getEvents);
router.get('/:eventId', eventValidation.getEvent, controller.getEvent);

// Routes protégées (manager/admin)
router.post(
  '/',
  auth(['admin', 'manager']),
  upload.single('image'),
  eventValidation.createEvent,
  controller.createEvent
);

router.patch(
  '/:eventId',
  auth(['admin', 'manager']),
  upload.single('image'),
  eventValidation.updateEvent,
  controller.updateEvent
);

router.delete(
  '/:eventId',
  auth(['admin', 'manager']),
  eventValidation.deleteEvent,
  controller.deleteEvent
);

// Gestion des vendeurs de l'événement
router.post(
  '/:eventId/vendors',
  auth(['admin', 'manager']),
  eventValidation.addVendor,
  controller.addVendor
);

router.delete(
  '/:eventId/vendors/:vendorId',
  auth(['admin', 'manager']),
  eventValidation.removeVendor,
  controller.removeVendor
);

// Gestion des publicités
router.post(
  '/:eventId/advertisements',
  auth(['admin', 'manager']),
  eventValidation.addAdvertisement,
  controller.addAdvertisement
);

export default router; 