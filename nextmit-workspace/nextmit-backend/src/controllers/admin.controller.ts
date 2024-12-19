import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { Event } from '../models/Event';
import { Vendor } from '../models/Vendor';
import { Ticket } from '../models/Ticket';
import { AppError } from '../middleware/error';
import { logger } from '../config/logger';
import { catchAsync } from '../utils/catchAsync';
import { Story } from '../models/Story';
import { Advertisement } from '../models/Advertisement';

export class AdminController {
  async getDashboardStats(req: Request, res: Response) {
    try {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const [
        totalUsers,
        newUsers,
        totalEvents,
        activeEvents,
        totalTickets,
        monthlyRevenue,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ createdAt: { $gte: lastMonth } }),
        Event.countDocuments(),
        Event.countDocuments({
          startDate: { $lte: now },
          endDate: { $gte: now },
        }),
        Ticket.countDocuments(),
        Ticket.aggregate([
          {
            $match: {
              createdAt: { $gte: lastMonth },
              status: 'confirmed',
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ['$price', '$quantity'] } },
            },
          },
        ]),
      ]);

      res.status(200).json({
        success: true,
        data: {
          users: {
            total: totalUsers,
            new: newUsers,
          },
          events: {
            total: totalEvents,
            active: activeEvents,
          },
          tickets: {
            total: totalTickets,
          },
          revenue: {
            monthly: monthlyRevenue[0]?.total || 0,
          },
        },
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques:', error);
      throw new AppError('Erreur lors de la récupération des statistiques', 500);
    }
  }

  async getEventStats(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const dateFilter: any = {};

      if (startDate) {
        dateFilter.startDate = { $gte: new Date(startDate as string) };
      }
      if (endDate) {
        dateFilter.endDate = { $lte: new Date(endDate as string) };
      }

      const stats = await Event.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalCapacity: { $sum: '$capacity' },
            averagePrice: { $avg: '$price' },
          },
        },
      ]);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques des événements:', error);
      throw new AppError('Erreur lors de la récupération des statistiques des événements', 500);
    }
  }

  async getPaymentStats(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const dateFilter: any = {};

      if (startDate) {
        dateFilter.createdAt = { $gte: new Date(startDate as string) };
      }
      if (endDate) {
        dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(endDate as string) };
      }

      const stats = await Ticket.aggregate([
        { $match: { ...dateFilter, status: 'confirmed' } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            revenue: { $sum: { $multiply: ['$price', '$quantity'] } },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques de paiement:', error);
      throw new AppError('Erreur lors de la récupération des statistiques de paiement', 500);
    }
  }

  getUsers = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string;
    const search = req.query.search as string;

    const query: any = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort('-createdAt');

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  });

  getUser = catchAsync(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate({
        path: 'tickets',
        select: 'eventId status purchaseDate quantity price'
      });

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  });

  updateUser = catchAsync(async (req: Request, res: Response) => {
    const allowedUpdates = ['firstName', 'lastName', 'email', 'phone', 'role', 'isVerified'];
    const updates = Object.keys(req.body);
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      throw new AppError('Certains champs de mise à jour ne sont pas autorisés', 400);
    }

    const user = await User.findById(req.params.userId);
    
    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    if (user.role === 'super_admin' && (req.user as IUser).role !== 'super_admin') {
      throw new AppError('Vous n\'avez pas l\'autorisation de modifier un super admin', 403);
    }

    updates.forEach(update => {
      if (allowedUpdates.includes(update)) {
        (user as any)[update] = req.body[update];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  });

  deleteUser = catchAsync(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    if (user.role === 'super_admin') {
      throw new AppError('Impossible de supprimer un super admin', 403);
    }

    const hasTickets = await Ticket.exists({ userId: user._id });
    const hasEvents = await Event.exists({ organizer: user._id });

    if (hasTickets || hasEvents) {
      throw new AppError(
        'Impossible de supprimer cet utilisateur car il a des tickets ou des événements associés',
        400
      );
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  });

  async updateUserRole(req: Request, res: Response) {
    try {
      const { role } = req.body;

      // Vérifier que le rôle est valide
      const validRoles = ['user', 'admin', 'organizer'];
      if (!validRoles.includes(role)) {
        throw new AppError('Rôle invalide', 400);
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du rôle:', error);
      throw new AppError('Erreur lors de la mise à jour du rôle', 500);
    }
  }

  // Gestion des événements
  getEvents = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const query: any = {};
    
    if (status) {
      const now = new Date();
      switch (status) {
        case 'active':
          query.startDate = { $lte: now };
          query.endDate = { $gte: now };
          break;
        case 'upcoming':
          query.startDate = { $gt: now };
          break;
        case 'past':
          query.endDate = { $lt: now };
          break;
      }
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .populate('organizer', 'firstName lastName email')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort('-createdAt');

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  });

  getEvent = catchAsync(async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.eventId)
      .populate('organizer', 'firstName lastName email')
      .populate('vendors', 'name description');

    if (!event) {
      throw new AppError('Événement non trouvé', 404);
    }

    res.status(200).json({
      success: true,
      data: event
    });
  });

  updateEvent = catchAsync(async (req: Request, res: Response) => {
    const allowedUpdates = ['name', 'description', 'type', 'capacity', 'price', 'startDate', 'endDate', 'location', 'status'];
    const updates = Object.keys(req.body);
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      throw new AppError('Certains champs de mise à jour ne sont pas autorisés', 400);
    }

    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      throw new AppError('Événement non trouvé', 404);
    }

    res.status(200).json({
      success: true,
      data: event
    });
  });

  deleteEvent = catchAsync(async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      throw new AppError('Événement non trouvé', 404);
    }

    const hasTickets = await Ticket.exists({ eventId: event._id });
    if (hasTickets) {
      throw new AppError('Impossible de supprimer un événement avec des tickets vendus', 400);
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Événement supprimé avec succès'
    });
  });

  // Gestion des vendeurs
  getVendors = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const vendors = await Vendor.find(query)
      .populate('manager', 'firstName lastName email')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort('-createdAt');

    const total = await Vendor.countDocuments(query);

    res.status(200).json({
      success: true,
      data: vendors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  });

  getVendor = catchAsync(async (req: Request, res: Response) => {
    const vendor = await Vendor.findById(req.params.vendorId)
      .populate('manager', 'firstName lastName email')
      .populate('events', 'name startDate endDate');

    if (!vendor) {
      throw new AppError('Vendeur non trouvé', 404);
    }

    res.status(200).json({
      success: true,
      data: vendor
    });
  });

  updateVendor = catchAsync(async (req: Request, res: Response) => {
    const allowedUpdates = ['name', 'description', 'phone', 'email', 'address', 'categories'];
    const updates = Object.keys(req.body);
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      throw new AppError('Certains champs de mise à jour ne sont pas autorisés', 400);
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.vendorId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      throw new AppError('Vendeur non trouvé', 404);
    }

    res.status(200).json({
      success: true,
      data: vendor
    });
  });

  deleteVendor = catchAsync(async (req: Request, res: Response) => {
    const vendor = await Vendor.findById(req.params.vendorId);

    if (!vendor) {
      throw new AppError('Vendeur non trouvé', 404);
    }

    const hasEvents = await Event.exists({ vendors: vendor._id });
    if (hasEvents) {
      throw new AppError('Impossible de supprimer un vendeur associé à des événements', 400);
    }

    await vendor.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Vendeur supprimé avec succès'
    });
  });

  // Gestion des Stories
  getStories = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const isArchived = req.query.archived === 'true';

    const query: any = { isArchived };
    
    const stories = await Story.find(query)
      .populate('user', 'firstName lastName email')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort('-createdAt');

    const total = await Story.countDocuments(query);

    res.status(200).json({
      success: true,
      data: stories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  });

  getStory = catchAsync(async (req: Request, res: Response) => {
    const story = await Story.findById(req.params.storyId)
      .populate('user', 'firstName lastName email')
      .populate('viewers.user', 'firstName lastName email');

    if (!story) {
      throw new AppError('Story non trouvée', 404);
    }

    res.status(200).json({
      success: true,
      data: story
    });
  });

  deleteStory = catchAsync(async (req: Request, res: Response) => {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      throw new AppError('Story non trouvée', 404);
    }

    await story.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Story supprimée avec succès'
    });
  });

  // Gestion des Publicités
  getAdvertisements = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const type = req.query.type as string;

    const query: any = {};
    
    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    const ads = await Advertisement.find(query)
      .populate('advertiser', 'firstName lastName email')
      .populate('targeting.events', 'name startDate endDate')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort('-createdAt');

    const total = await Advertisement.countDocuments(query);

    res.status(200).json({
      success: true,
      data: ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  });

  getAdvertisement = catchAsync(async (req: Request, res: Response) => {
    const ad = await Advertisement.findById(req.params.adId)
      .populate('advertiser', 'firstName lastName email')
      .populate('targeting.events', 'name startDate endDate');

    if (!ad) {
      throw new AppError('Publicité non trouvée', 404);
    }

    res.status(200).json({
      success: true,
      data: ad
    });
  });

  updateAdvertisement = catchAsync(async (req: Request, res: Response) => {
    const allowedUpdates = ['status', 'schedule', 'targeting', 'budget'];
    const updates = Object.keys(req.body);
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      throw new AppError('Certains champs de mise à jour ne sont pas autorisés', 400);
    }

    const ad = await Advertisement.findByIdAndUpdate(
      req.params.adId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ad) {
      throw new AppError('Publicité non trouvée', 404);
    }

    res.status(200).json({
      success: true,
      data: ad
    });
  });

  deleteAdvertisement = catchAsync(async (req: Request, res: Response) => {
    const ad = await Advertisement.findById(req.params.adId);

    if (!ad) {
      throw new AppError('Publicité non trouvée', 404);
    }

    if (ad.status === 'active') {
      throw new AppError('Impossible de supprimer une publicité active', 400);
    }

    await ad.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Publicité supprimée avec succès'
    });
  });
} 