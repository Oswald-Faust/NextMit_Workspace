import { body, param } from 'express-validator';
import { validateResults } from '../middleware/validate';

export const storyValidation = {
  createStory: [
    body('caption')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('La légende ne peut pas dépasser 500 caractères'),
    body('location')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('La localisation ne peut pas dépasser 100 caractères'),
    validateResults
  ],

  viewStory: [
    param('storyId')
      .isMongoId()
      .withMessage('ID de story invalide'),
    validateResults
  ],

  archiveStory: [
    param('storyId')
      .isMongoId()
      .withMessage('ID de story invalide'),
    validateResults
  ],

  deleteStory: [
    param('storyId')
      .isMongoId()
      .withMessage('ID de story invalide'),
    validateResults
  ]
}; 