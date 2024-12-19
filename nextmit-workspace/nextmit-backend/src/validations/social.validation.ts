import { body, param } from 'express-validator';
import { validateResults } from '../middleware/validate';

export const socialValidation = {
  sendFriendRequest: [
    param('userId')
      .isMongoId()
      .withMessage('ID utilisateur invalide'),
      validateResults
  ],

  handleFriendRequest: [
    param('requestId')
      .isMongoId()
      .withMessage('ID de demande invalide'),
      validateResults
  ],

  sendMessage: [
    param('receiverId')
      .isMongoId()
      .withMessage('ID destinataire invalide'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Le contenu du message est requis')
      .isLength({ max: 1000 })
      .withMessage('Le message ne peut pas dépasser 1000 caractères'),
      validateResults
  ]
}; 