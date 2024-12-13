import { Router } from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventTickets,
  bookTicket,
} from '../controllers/event.controller';
import { protect, authorize } from '../middleware/auth';
import { validateCreateEvent, validateUpdateEvent } from '../middleware/validate';
import { uploadEventImage } from '../middleware/upload';

const router = Router();

// Routes publiques
router.get('/', getEvents);
router.get('/:id', getEvent);

// Routes protégées
router.use(protect);

// Routes pour les organisateurs
router.post(
  '/',
  authorize('admin', 'organizer'),
  uploadEventImage,
  validateCreateEvent,
  createEvent
);

router.put(
  '/:id',
  authorize('admin', 'organizer'),
  uploadEventImage,
  validateUpdateEvent,
  updateEvent
);

router.delete('/:id', authorize('admin', 'organizer'), deleteEvent);

// Routes pour les tickets
router.get('/:id/tickets', getEventTickets);
router.post('/:id/book', bookTicket);

export default router; 