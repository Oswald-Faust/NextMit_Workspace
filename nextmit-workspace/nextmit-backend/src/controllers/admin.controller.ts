import { Request, Response } from 'express';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Ticket } from '../models/Ticket';
import { AppError } from '../middleware/error';
import { logger } from '../config/logger';

// @desc    Obtenir les statistiques du tableau de bord
// @route   GET /api/v1/admin/stats/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req: Request, res: Response) => {
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
};

// @desc    Obtenir les statistiques des événements
// @route   GET /api/v1/admin/stats/events
// @access  Private (Admin)
export const getEventStats = async (req: Request, res: Response) => {
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
};

// @desc    Obtenir les statistiques des paiements
// @route   GET /api/v1/admin/stats/payments
// @access  Private (Admin)
export const getPaymentStats = async (req: Request, res: Response) => {
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
};

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
      },
      data: users,
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des utilisateurs:', error);
    throw new AppError('Erreur lors de la récupération des utilisateurs', 500);
  }
};

// @desc    Mettre à jour le rôle d'un utilisateur
// @route   PUT /api/v1/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req: Request, res: Response) => {
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
};

// @desc    Supprimer un utilisateur
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Empêcher la suppression d'un super admin
    if (user.role === 'super_admin') {
      throw new AppError('Impossible de supprimer un super admin', 403);
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    logger.error('Erreur lors de la suppression de l\'utilisateur:', error);
    throw new AppError('Erreur lors de la suppression de l\'utilisateur', 500);
  }
}; 