import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { AppError } from './error';

export const validateRegister = [
  check('firstName')
    .trim()
    .notEmpty()
    .withMessage('Le prénom est requis')
    .isLength({ min: 2 })
    .withMessage('Le prénom doit contenir au moins 2 caractères'),
  check('lastName')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2 })
    .withMessage('Le nom doit contenir au moins 2 caractères'),
  check('email')
    .trim()
    .notEmpty()
    .withMessage('L\'email est requis')
    .isEmail()
    .withMessage('Format d\'email invalide'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Le mot de passe est requis')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  check('phone')
    .trim()
    .notEmpty()
    .withMessage('Le numéro de téléphone est requis')
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .withMessage('Format de numéro de téléphone invalide'),
  validateResults,
];

export const validateLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    next();
  }
];

export const validateCreateEvent = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 3 })
    .withMessage('Le nom doit contenir au moins 3 caractères'),
  check('description')
    .trim()
    .notEmpty()
    .withMessage('La description est requise')
    .isLength({ min: 20 })
    .withMessage('La description doit contenir au moins 20 caractères'),
  check('type')
    .trim()
    .notEmpty()
    .withMessage('Le type est requis')
    .isIn(['food', 'drink', 'music', 'art', 'other'])
    .withMessage('Type d\'événement invalide'),
  check('location')
    .trim()
    .notEmpty()
    .withMessage('Le lieu est requis'),
  check('startDate')
    .notEmpty()
    .withMessage('La date de début est requise')
    .isISO8601()
    .withMessage('Format de date invalide'),
  check('endDate')
    .notEmpty()
    .withMessage('La date de fin est requise')
    .isISO8601()
    .withMessage('Format de date invalide')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('La date de fin doit être après la date de début');
      }
      return true;
    }),
  check('price')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  check('capacity')
    .isInt({ min: 1 })
    .withMessage('La capacité doit être un nombre entier positif'),
  validateResults,
];

export const validateUpdateEvent = [
  check('name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Le nom doit contenir au moins 3 caractères'),
  check('description')
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage('La description doit contenir au moins 20 caractères'),
  check('type')
    .optional()
    .trim()
    .isIn(['food', 'drink', 'music', 'art', 'other'])
    .withMessage('Type d\'événement invalide'),
  check('startDate')
    .optional()
    .isISO8601()
    .withMessage('Format de date invalide'),
  check('endDate')
    .optional()
    .isISO8601()
    .withMessage('Format de date invalide')
    .custom((value, { req }) => {
      if (req.body.startDate && new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('La date de fin doit être après la date de début');
      }
      return true;
    }),
  check('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  check('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La capacité doit être un nombre entier positif'),
  validateResults,
];

export const validateUpdateProfile = [
  check('firstName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Le prénom doit contenir au moins 2 caractères'),
  check('lastName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Le nom doit contenir au moins 2 caractères'),
  check('phone')
    .optional()
    .trim()
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .withMessage('Format de numéro de téléphone invalide'),
  validateResults,
];

export const validateUpdatePassword = [
  check('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('Le mot de passe actuel est requis'),
  check('newPassword')
    .trim()
    .notEmpty()
    .withMessage('Le nouveau mot de passe est requis')
    .isLength({ min: 8 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères'),
  validateResults,
];

function validateResults(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(error => error.msg);
    throw new AppError(messages[0], 400);
  }
  next();
} 