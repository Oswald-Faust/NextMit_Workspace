import { Router } from 'express';
import { AdvertisementController } from '../controllers/advertisement.controller';
import { auth } from '../middleware/auth';
import { advertisementValidation } from '../validations/advertisement.validation';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new AdvertisementController();

// Routes publiques pour voir les publicités
router.get('/public', controller.getPublicAds);

// Routes protégées pour la gestion des publicités
router.use(auth(['manager', 'admin']));

router.post('/',
  upload.single('media'),
  advertisementValidation.createAd,
  controller.createAd
);

router.get('/my-ads', controller.getMyAds);
router.get('/:adId', controller.getAd);
router.patch('/:adId', controller.updateAd);
router.delete('/:adId', controller.deleteAd);
router.post('/:adId/metrics/view', controller.recordView);
router.post('/:adId/metrics/click', controller.recordClick);

export default router; 