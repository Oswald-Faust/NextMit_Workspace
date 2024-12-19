import { Router } from 'express';
import { StoryController } from '../controllers/story.controller';
import { auth } from '../middleware/auth';
import { storyValidation } from '../validations/story.validation';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new StoryController();

// Routes protégées (utilisateur connecté)
router.use(auth(['user', 'admin', 'manager']));

// Création et gestion des stories
router.post('/', 
  upload.single('media'),
  storyValidation.createStory, 
  controller.createStory
);

router.get('/my-stories', controller.getMyStories);
router.get('/feed', controller.getStoriesFeed);
router.post('/:storyId/view', controller.viewStory);
router.delete('/:storyId', controller.deleteStory);
router.patch('/:storyId/archive', controller.archiveStory);

export default router; 