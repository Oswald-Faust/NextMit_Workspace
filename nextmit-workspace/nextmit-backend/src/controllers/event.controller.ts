import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { Ticket } from '../models/Ticket';
import { AppError } from '../middleware/error';
import { logger } from '../config/logger';
import { uploadService } from '../services/upload.service';

// @desc    Obtenir tous les événements
// @route   GET /api/v1/events
// @access  Public
export const getEvents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || '-createdAt';

    const query = Event.find()
      .sort(sort as any)
      .skip((page - 1) * limit)
      .limit(limit);

    const [items, total] = await Promise.all([
      query.exec(),
      Event.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des événements'
    });
  }
};

// @desc    Obtenir un événement spécifique
// @route   GET /api/v1/events/:id
// @access  Public
export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName')
      .populate('participants', 'firstName lastName');

    if (!event) {
      throw new AppError('Événement non trouvé', 404);
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'événement:', error);
    throw new AppError('Erreur lors de la récupération de l\'événement', 500);
  }
};

// @desc    Créer un événement
// @route   POST /api/v1/events
// @access  Private (Admin, Organizer)
export const createEvent = async (req: Request, res: Response) => {
  try {
    const eventData = req.body;

    // Upload de l'image si présente
    if (req.file) {
      const imageUrl = await uploadService.uploadImage(req.file, 'events');
      eventData.imageUrl = imageUrl;
    }

    // Ajouter l'organisateur
    eventData.organizer = req.user._id;

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    logger.error('Erreur lors de la création de l\'événement:', error);
    throw new AppError('Erreur lors de la création de l\'événement', 500);
  }
};

// @desc    Mettre à jour un événement
// @route   PUT /api/v1/events/:id
// @access  Private (Admin, Organizer)
export const updateEvent = async (req: Request, res: Response) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      throw new AppError('Événement non trouvé', 404);
    }

    // Vérifier les permissions
    if (event.organizer.toString() !== req.user._id && req.user.role !== 'admin') {
      throw new AppError('Non autorisé à modifier cet événement', 403);
    }

    const eventData = req.body;

    // Upload de la nouvelle image si présente
    if (req.file) {
      const imageUrl = await uploadService.uploadImage(req.file, 'events');
      eventData.imageUrl = imageUrl;

      // Supprimer l'ancienne image
      if (event.imageUrl) {
        await uploadService.deleteImage(event.imageUrl);
      }
    }

    event = await Event.findByIdAndUpdate(req.params.id, eventData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour de l\'événement:', error);
    throw new AppError('Erreur lors de la mise à jour de l\'événement', 500);
  }
};

// @desc    Supprimer un événement
// @route   DELETE /api/v1/events/:id
// @access  Private (Admin, Organizer)
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new AppError('Événement non trouvé', 404);
    }

    // Vérifier les permissions
    if (event.organizer.toString() !== req.user._id && req.user.role !== 'admin') {
      throw new AppError('Non autorisé à supprimer cet événement', 403);
    }

    // Supprimer l'image associée
    if (event.imageUrl) {
      await uploadService.deleteImage(event.imageUrl);
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    logger.error('Erreur lors de la suppression de l\'événement:', error);
    throw new AppError('Erreur lors de la suppression de l\'événement', 500);
  }
};

// @desc    Obtenir les tickets d'un événement
// @route   GET /api/v1/events/:id/tickets
// @access  Private
export const getEventTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find({ event: req.params.id })
      .populate('user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des tickets:', error);
    throw new AppError('Erreur lors de la récupération des tickets', 500);
  }
};

// @desc    Réserver un ticket
// @route   POST /api/v1/events/:id/book
// @access  Private
export const bookTicket = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new AppError('Événement non trouvé', 404);
    }

    // Vérifier la disponibilité
    const { type, quantity } = req.body;
    const ticketType = event.tickets.find(t => t.type === type);

    if (!ticketType) {
      throw new AppError('Type de ticket non trouvé', 404);
    }

    if (ticketType.sold + quantity > ticketType.quantity) {
      throw new AppError('Plus de tickets disponibles', 400);
    }

    // Créer le ticket
    const ticket = await Ticket.create({
      event: event._id,
      user: req.user._id,
      type,
      price: ticketType.price,
      quantity,
    });

    // Mettre à jour le nombre de tickets vendus
    ticketType.sold += quantity;
    await event.save();

    res.status(201).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    logger.error('Erreur lors de la réservation du ticket:', error);
    throw new AppError('Erreur lors de la réservation du ticket', 500);
  }
}; 