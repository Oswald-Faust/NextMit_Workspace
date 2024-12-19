import { check } from 'express-validator';
import { validateResults } from '../middleware/validate';

export const eventValidation = {
  getEvents: [
    check('startDate')
      .optional()
      .isISO8601()
      .withMessage('Format de date invalide'),
    check('endDate')
      .optional()
      .isISO8601()
      .withMessage('Format de date invalide'),
    check('category')
      .optional()
      .isString()
      .withMessage('Catégorie invalide'),
    validateResults
  ],

  getEvent: [
    check('eventId')
      .isMongoId()
      .withMessage('ID d\'événement invalide'),
    validateResults
  ],

  createEvent: [
    check('title')
      .trim()
      .notEmpty()
      .withMessage('Le titre est requis')
      .isLength({ min: 3, max: 100 })
      .withMessage('Le titre doit contenir entre 3 et 100 caractères'),

    check('description')
      .trim()
      .notEmpty()
      .withMessage('La description est requise')
      .isLength({ min: 20, max: 2000 })
      .withMessage('La description doit contenir entre 20 et 2000 caractères'),

    check('startDate')
      .notEmpty()
      .withMessage('La date de début est requise')
      .isISO8601()
      .withMessage('Format de date invalide')
      .custom((value, { req }) => {
        if (new Date(value) < new Date()) {
          throw new Error('La date de début doit être dans le futur');
        }
        return true;
      }),

    check('endDate')
      .notEmpty()
      .withMessage('La date de fin est requise')
      .isISO8601()
      .withMessage('Format de date invalide')
      .custom((value, { req }) => {
        if (new Date(value) < new Date(req.body.startDate)) {
          throw new Error('La date de fin doit être après la date de début');
        }
        return true;
      }),

    check('location')
      .trim()
      .notEmpty()
      .withMessage('Le lieu est requis'),

    check('category')
      .trim()
      .notEmpty()
      .withMessage('La catégorie est requise'),

    check('capacity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La capacité doit être un nombre entier positif'),

    check('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Le prix doit être un nombre positif'),

    check('tags')
      .optional()
      .isArray()
      .withMessage('Les tags doivent être un tableau'),

    check('isPublic')
      .optional()
      .isBoolean()
      .withMessage('isPublic doit être un booléen'),

    validateResults,
  ],

  updateEvent: [
    check('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Le titre doit contenir entre 3 et 100 caractères'),

    check('description')
      .optional()
      .trim()
      .isLength({ min: 20, max: 2000 })
      .withMessage('La description doit contenir entre 20 et 2000 caractères'),

    check('startDate')
      .optional()
      .isISO8601()
      .withMessage('Format de date invalide')
      .custom((value, { req }) => {
        if (new Date(value) < new Date()) {
          throw new Error('La date de début doit être dans le futur');
        }
        return true;
      }),

    check('endDate')
      .optional()
      .isISO8601()
      .withMessage('Format de date invalide')
      .custom((value, { req }) => {
        if (req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
          throw new Error('La date de fin doit être après la date de début');
        }
        return true;
      }),

    check('location')
      .optional()
      .trim(),

    check('capacity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La capacité doit être un nombre entier positif'),

    check('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Le prix doit être un nombre positif'),

    validateResults,
  ],

  deleteEvent: [
    check('eventId')
      .isMongoId()
      .withMessage('ID d\'événement invalide'),
    validateResults
  ],

  addVendor: [
    check('vendorId')
      .isMongoId()
      .withMessage('ID de vendeur invalide'),
    validateResults
  ],

  removeVendor: [
    check('vendorId')
      .isMongoId()
      .withMessage('ID de vendeur invalide'),
    validateResults
  ],

  addAdvertisement: [
    check('title')
      .trim()
      .notEmpty()
      .withMessage('Le titre est requis')
      .isLength({ min: 3, max: 100 })
      .withMessage('Le titre doit contenir entre 3 et 100 caractères'),
    check('description')
      .trim()
      .notEmpty()
      .withMessage('La description est requise')
      .isLength({ min: 10, max: 500 })
      .withMessage('La description doit contenir entre 10 et 500 caractères'),
    check('startDate')
      .isISO8601()
      .withMessage('Format de date invalide'),
    check('endDate')
      .isISO8601()
      .withMessage('Format de date invalide'),
    validateResults
  ]
};

export const validateEventRegistration = [
  check('numberOfTickets')
    .notEmpty()
    .withMessage('Le nombre de tickets est requis')
    .isInt({ min: 1 })
    .withMessage('Le nombre de tickets doit être un nombre entier positif'),

  validateResults,
];