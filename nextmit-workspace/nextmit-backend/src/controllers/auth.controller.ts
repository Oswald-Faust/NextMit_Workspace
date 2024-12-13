import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/error';
import { logger } from '../config/logger';
import { config } from '../config';

const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Cet email est déjà utilisé', 400);
    }

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    // Générer le token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Erreur lors de l\'inscription:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Erreur lors de l\'inscription', 500);
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    // Destructurer directement req.body
    const { email, password } = req.body;
    
    logger.debug('Tentative de connexion pour:', email);

    // Validation basique
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Vérifier que l'email est une chaîne de caractères
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Format invalide pour email ou mot de passe'
      });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      logger.debug('Utilisateur non trouvé:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.debug('Mot de passe incorrect pour:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token
    const token = generateToken(user._id, user.role);

    logger.debug('Connexion réussie pour:', email);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }
    });
  } catch (error) {
    logger.error('Erreur lors de la connexion:', error);
    throw new AppError('Erreur lors de la connexion', 500);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du profil:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Erreur lors de la récupération du profil', 500);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du profil:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Erreur lors de la mise à jour du profil', 500);
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Vérifier le mot de passe actuel
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Mot de passe actuel incorrect', 401);
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    // Générer un nouveau token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du mot de passe:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Erreur lors de la mise à jour du mot de passe', 500);
  }
}; 