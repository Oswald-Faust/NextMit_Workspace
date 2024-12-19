import { check } from 'express-validator';
import { validateResults } from '../middleware/validate';

export const validateCreateVendor = [
  check('name')
    .trim()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),

  check('description')
    .trim()
    .notEmpty()
    .withMessage('La description est requise')
    .isLength({ min: 20, max: 1000 })
    .withMessage('La description doit contenir entre 20 et 1000 caractères'),

  check('address')
    .trim()
    .notEmpty()
    .withMessage('L\'adresse est requise'),

  check('city')
    .trim()
    .notEmpty()
    .withMessage('La ville est requise'),

  check('postalCode')
    .trim()
    .notEmpty()
    .withMessage('Le code postal est requis')
    .matches(/^\d{5}$/)
    .withMessage('Code postal invalide'),

  check('phone')
    .trim()
    .notEmpty()
    .withMessage('Le numéro de téléphone est requis')
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .withMessage('Numéro de téléphone invalide'),

  check('email')
    .trim()
    .notEmpty()
    .withMessage('L\'email est requis')
    .isEmail()
    .withMessage('Email invalide'),

  check('category')
    .trim()
    .notEmpty()
    .withMessage('La catégorie est requise'),

  check('openingHours')
    .isArray()
    .withMessage('Les horaires d\'ouverture doivent être un tableau')
    .custom((value) => {
      if (!Array.isArray(value)) return false;
      return value.every(day => {
        return day.hasOwnProperty('day') &&
               day.hasOwnProperty('open') &&
               day.hasOwnProperty('close') &&
               /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(day.open) &&
               /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(day.close);
      });
    })
    .withMessage('Format des horaires d\'ouverture invalide'),

  validateResults,
];

export const validateUpdateVendor = [
  check('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),

  check('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('La description doit contenir entre 20 et 1000 caractères'),

  check('address')
    .optional()
    .trim(),

  check('city')
    .optional()
    .trim(),

  check('postalCode')
    .optional()
    .trim()
    .matches(/^\d{5}$/)
    .withMessage('Code postal invalide'),

  check('phone')
    .optional()
    .trim()
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .withMessage('Numéro de téléphone invalide'),

  check('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email invalide'),

  check('openingHours')
    .optional()
    .isArray()
    .withMessage('Les horaires d\'ouverture doivent être un tableau')
    .custom((value) => {
      if (!Array.isArray(value)) return false;
      return value.every(day => {
        return day.hasOwnProperty('day') &&
               day.hasOwnProperty('open') &&
               day.hasOwnProperty('close') &&
               /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(day.open) &&
               /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(day.close);
      });
    })
    .withMessage('Format des horaires d\'ouverture invalide'),

  validateResults,
];

export const validateMenuCategory = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom de la catégorie est requis')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),

  check('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La description ne doit pas dépasser 200 caractères'),

  validateResults,
];

export const validateMenuItem = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom du produit est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),

  check('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne doit pas dépasser 500 caractères'),

  check('price')
    .notEmpty()
    .withMessage('Le prix est requis')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),

  check('category')
    .trim()
    .notEmpty()
    .withMessage('La catégorie est requise'),

  validateResults,
]; 