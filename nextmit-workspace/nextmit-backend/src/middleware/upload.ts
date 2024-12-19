import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError';

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Le fichier doit être une image'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Middleware pour l'upload d'image d'événement
export const uploadEventImage = (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res as any, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'Le fichier est trop volumineux. Maximum 5MB.'));
      }
      return next(new ApiError(400, 'Erreur lors de l\'upload du fichier.'));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

// Middleware pour l'upload d'image de profil
export const uploadProfileImage = (req: Request, res: Response, next: NextFunction) => {
  upload.single('profileImage')(req, res as any, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'Le fichier est trop volumineux. Maximum 5MB.'));
      }
      return next(new ApiError(400, 'Erreur lors de l\'upload du fichier.'));
    } else if (err) {
      return next(err);
    }
    next();
  });
}; 