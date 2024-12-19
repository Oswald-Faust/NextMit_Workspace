import { Advertisement, IAdvertisement } from '../models/Advertisement';
import { Event } from '../models/Event';
import { CloudStorageService } from './cloudStorage.service';
import { PaymentService } from './payment.service';
import { CacheService } from './cache.service';
import { ApiError } from '../utils/ApiError';
import { Types } from 'mongoose';

export class AdvertisementService {
  constructor(
    private cloudStorage: CloudStorageService,
    private paymentService: PaymentService,
    private cacheService: CacheService
  ) {}

  async createAd(advertiserId: string, adData: any, mediaFile: Express.Multer.File): Promise<IAdvertisement> {
    const mediaUrl = await this.cloudStorage.uploadMedia(mediaFile, 'advertisements');
    
    // Vérifier le paiement initial
    await this.paymentService.validateBudget(advertiserId, adData.budget.total);

    const ad = await Advertisement.create({
      ...adData,
      advertiser: advertiserId,
      content: {
        media: {
          type: mediaFile.mimetype.startsWith('image/') ? 'image' : 'video',
          url: mediaUrl,
          thumbnail: adData.thumbnail
        }
      }
    });

    await this.cacheService.invalidate('advertisements:public');
    return ad;
  }

  async getTargetedAds(userId: string, location: string): Promise<IAdvertisement[]> {
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);

    const ads = await Advertisement.find({
      status: 'active',
      'schedule.startDate': { $lte: now },
      'schedule.endDate': { $gte: now },
      'schedule.showTimes': {
        $elemMatch: {
          start: { $lte: timeStr },
          end: { $gte: timeStr }
        }
      },
      'targeting.locations': location,
      'budget.spent': { $lt: { $ref: 'budget.total' } }
    }).populate('advertiser', 'firstName lastName');

    return ads;
  }

  async recordMetric(adId: string, metricType: 'view' | 'click'): Promise<void> {
    const ad = await Advertisement.findById(adId);
    if (!ad) throw new ApiError(404, 'Publicité non trouvée');

    ad.metrics[metricType] += 1;
    ad.metrics.engagement = (ad.metrics.clicks / ad.metrics.views) * 100;

    if (metricType === 'click') {
      const clickCost = 0.5; // Coût par clic en EUR
      ad.budget.spent += clickCost;

      if (ad.budget.spent >= ad.budget.total) {
        ad.status = 'completed';
        await this.notifyBudgetExhausted(ad.advertiser.toString());
      }
    }

    await ad.save();
    await this.cacheService.invalidate(`advertisement:${adId}`);
  }

  private async notifyBudgetExhausted(advertiserId: string): Promise<void> {
    // Implémenter la notification
  }

  async generateReport(adId: string): Promise<any> {
    const ad = await Advertisement.findById(adId);
    if (!ad) throw new ApiError(404, 'Publicité non trouvée');

    return {
      id: ad._id,
      metrics: ad.metrics,
      budget: ad.budget,
      roi: (ad.metrics.clicks * 0.5) / ad.budget.spent,
      engagementRate: ad.metrics.engagement,
      status: ad.status
    };
  }
} 