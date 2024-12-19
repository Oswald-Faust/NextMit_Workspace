import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError';

interface ValidationErrorItem {
  field: string;
  message: string;
}

export const validateResults = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors: ValidationErrorItem[] = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : error.type,
      message: error.msg
    }));

    throw new ApiError(400, 'Erreur de validation', formattedErrors);
  }

  next();
}; 