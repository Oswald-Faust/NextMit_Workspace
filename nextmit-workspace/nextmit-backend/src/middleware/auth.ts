import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { logger } from '../config/logger';
import { AppError } from './error';

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      next(new AppError('Non autorisé à accéder à cette route', 401));
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      next(new AppError('Utilisateur non trouvé', 401));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Erreur d\'authentification:', error);
    next(new AppError('Non autorisé à accéder à cette route', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      next(new AppError(`Le rôle ${req.user.role} n'est pas autorisé à accéder à cette route`, 403));
      return;
    }
    next();
  };
}; 