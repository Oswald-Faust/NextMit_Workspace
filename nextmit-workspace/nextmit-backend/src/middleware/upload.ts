import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { AppError } from './error';

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Filtrer les types de fichiers
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Type de fichier non supporté. Utilisez JPG, PNG ou WebP.', 400));
  }
};

// Configuration de Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Middleware pour l'upload d'image d'événement
export const uploadEventImage = (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('Le fichier est trop volumineux. Maximum 5MB.', 400));
      }
      return next(new AppError('Erreur lors de l\'upload du fichier.', 400));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

// Middleware pour l'upload d'image de profil
export const uploadProfileImage = (req: Request, res: Response, next: NextFunction) => {
  upload.single('profileImage')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('Le fichier est trop volumineux. Maximum 5MB.', 400));
      }
      return next(new AppError('Erreur lors de l\'upload du fichier.', 400));
    } else if (err) {
      return next(err);
    }
    next();
  });
}; 