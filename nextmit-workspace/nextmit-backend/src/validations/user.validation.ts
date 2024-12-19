import { check } from 'express-validator';
import { validateResults } from '../middleware/validate';

export const userValidation = {
  updateProfile: [
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
      .withMessage('Numéro de téléphone invalide'),

    validateResults,
  ],

  updatePassword: [
    check('currentPassword')
      .trim()
      .notEmpty()
      .withMessage('Le mot de passe actuel est requis'),

    check('newPassword')
      .trim()
      .notEmpty()
      .withMessage('Le nouveau mot de passe est requis')
      .isLength({ min: 8 })
      .withMessage('Le mot de passe doit contenir au moins 8 caractères')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),

    validateResults,
  ],

  updatePreferences: [
    check('notifications')
      .optional()
      .isObject()
      .withMessage('Les préférences de notification doivent être un objet'),
    
    check('language')
      .optional()
      .isIn(['fr', 'en'])
      .withMessage('La langue doit être fr ou en'),

    check('theme')
      .optional()
      .isIn(['light', 'dark'])
      .withMessage('Le thème doit être light ou dark'),

    validateResults,
  ],

  getUsers: [
    check('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La page doit être un nombre entier positif'),

    check('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('La limite doit être entre 1 et 100'),

    check('role')
      .optional()
      .isIn(['user', 'admin', 'manager'])
      .withMessage('Rôle invalide'),

    validateResults,
  ],

  getUser: [
    check('userId')
      .isMongoId()
      .withMessage('ID utilisateur invalide'),

    validateResults,
  ],

  updateUser: [
    check('userId')
      .isMongoId()
      .withMessage('ID utilisateur invalide'),

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

    check('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Email invalide')
      .normalizeEmail(),

    check('role')
      .optional()
      .isIn(['user', 'admin', 'manager'])
      .withMessage('Rôle invalide'),

    check('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive doit être un booléen'),

    validateResults,
  ],

  deleteUser: [
    check('userId')
      .isMongoId()
      .withMessage('ID utilisateur invalide'),

    validateResults,
  ],
}; 