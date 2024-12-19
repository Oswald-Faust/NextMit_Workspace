import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = (allowedRoles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        throw new ApiError(401, 'Accès non autorisé. Token manquant');
      }

      try {
        const decoded = jwt.verify(token, config.jwt.secret) as any;
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
          throw new ApiError(401, 'Token invalide ou expiré');
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          throw new ApiError(403, 'Vous n\'avez pas les droits nécessaires pour accéder à cette ressource');
        }

        req.user = user;
        next();
      } catch (error) {
        throw new ApiError(401, 'Token invalide ou expiré');
      }
    } catch (error) {
      next(error);
    }
  };
}; 