import { Request, Response } from 'express';
import { Advertisement } from '../models/Advertisement';
import { AppError } from '../middleware/error';
import { catchAsync } from '../utils/catchAsync';

export class AdvertisementController {
  createAd = catchAsync(async (req: Request, res: Response) => {
    const adData = {
      ...req.body,
      advertiser: req.user.id,
      content: {
        media: {
          type: req.file?.mimetype.startsWith('image/') ? 'image' : 'video',
          url: req.file?.path,
          thumbnail: req.body.thumbnail
        },
        cta: req.body.cta
      }
    };

    const ad = await Advertisement.create(adData);

    res.status(201).json({
      success: true,
      data: ad
    });
  });

  getMyAds = catchAsync(async (req: Request, res: Response) => {
    const ads = await Advertisement.find({ advertiser: req.user.id })
      .populate('targeting.events', 'name startDate endDate')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: ads
    });
  });

  getPublicAds = catchAsync(async (req: Request, res: Response) => {
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5); // Format HH:mm

    const ads = await Advertisement.find({
      status: 'active',
      'schedule.startDate': { $lte: now },
      'schedule.endDate': { $gte: now },
      'schedule.showTimes': {
        $elemMatch: {
          start: { $lte: timeStr },
          end: { $gte: timeStr }
        }
      }
    }).populate('advertiser', 'firstName lastName');

    res.status(200).json({
      success: true,
      data: ads
    });
  });

  getAd = catchAsync(async (req: Request, res: Response) => {
    const ad = await Advertisement.findOne({
      _id: req.params.adId,
      advertiser: req.user.id
    })
    .populate('targeting.events', 'name startDate endDate');

    if (!ad) {
      throw new AppError('Publicité non trouvée', 404);
    }

    res.status(200).json({
      success: true,
      data: ad
    });
  });

  updateAd = catchAsync(async (req: Request, res: Response) => {
    const allowedUpdates = [
      'title',
      'description',
      'status',
      'schedule',
      'targeting',
      'budget'
    ];
    
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      throw new AppError('Certains champs de mise à jour ne sont pas autorisés', 400);
    }

    const ad = await Advertisement.findOne({
      _id: req.params.adId,
      advertiser: req.user.id
    });

    if (!ad) {
      throw new AppError('Publicité non trouvée', 404);
    }

    // Vérifications spécifiques
    if (ad.status === 'completed') {
      throw new AppError('Impossible de modifier une publicité terminée', 400);
    }

    if (req.body.status === 'active') {
      // Vérifier le budget disponible
      if (ad.budget.spent >= ad.budget.total) {
        throw new AppError('Budget épuisé pour cette publicité', 400);
      }
    }

    updates.forEach(update => {
      (ad as any)[update] = req.body[update];
    });

    await ad.save();

    res.status(200).json({
      success: true,
      data: ad
    });
  });

  deleteAd = catchAsync(async (req: Request, res: Response) => {
    const ad = await Advertisement.findOne({
      _id: req.params.adId,
      advertiser: req.user.id
    });

    if (!ad) {
      throw new AppError('Publicité non trouvée', 404);
    }

    if (ad.status === 'active') {
      throw new AppError('Impossible de supprimer une publicité active', 400);
    }

    await ad.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Publicité supprimée avec succès'
    });
  });

  recordView = catchAsync(async (req: Request, res: Response) => {
    const ad = await Advertisement.findById(req.params.adId);
    
    if (!ad) {
      throw new AppError('Publicité non trouvée', 404);
    }

    ad.metrics.views += 1;
    ad.metrics.engagement = (ad.metrics.clicks / ad.metrics.views) * 100;
    
    await ad.save();

    res.status(200).json({
      success: true,
      data: ad.metrics
    });
  });

  recordClick = catchAsync(async (req: Request, res: Response) => {
    const ad = await Advertisement.findById(req.params.adId);
    
    if (!ad) {
      throw new AppError('Publicité non trouvée', 404);
    }

    ad.metrics.clicks += 1;
    ad.metrics.engagement = (ad.metrics.clicks / ad.metrics.views) * 100;
    
    await ad.save();

    res.status(200).json({
      success: true,
      data: ad.metrics
    });
  });
} 