import { body, query, param } from 'express-validator';
import { validateResults } from '../middleware/validate';
import { validateRequest } from '@/middlewares/validate-request';

export const advertisementValidation = {
  createAd: [
    body('title').trim().notEmpty().withMessage('Le titre est requis'),
    body('description').trim().notEmpty().withMessage('La description est requise'),
    body('type')
      .isIn(['banner', 'popup', 'story', 'feed'])
      .withMessage('Type de publicité invalide'),
    body('schedule.startDate')
      .isISO8601()
      .withMessage('Date de début invalide'),
    body('schedule.endDate')
      .isISO8601()
      .withMessage('Date de fin invalide'),
    body('budget.total')
      .isNumeric()
      .withMessage('Le budget total doit être un nombre'),
      validateResults
  ],

  updateAd: [
    param('adId').isMongoId().withMessage('ID de publicité invalide'),
    body('status')
      .optional()
      .isIn(['draft', 'active', 'paused', 'completed'])
      .withMessage('Statut invalide'),
    body('schedule.startDate')
      .optional()
      .isISO8601()
      .withMessage('Date de début invalide'),
    body('schedule.endDate')
      .optional()
      .isISO8601()
      .withMessage('Date de fin invalide'),
    body('budget.total')
      .optional()
      .isNumeric()
      .withMessage('Le budget total doit être un nombre'),
      validateResults
  ],

  getAd: [
    param('adId').isMongoId().withMessage('ID de publicité invalide'),
    validateResults
  ],

  deleteAd: [
    param('adId').isMongoId().withMessage('ID de publicité invalide'),
    validateRequest
  ]
}; 