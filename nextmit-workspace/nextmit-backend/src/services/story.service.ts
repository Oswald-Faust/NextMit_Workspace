import { Story, IStory } from '../models/Story';
import { User } from '../models/User';
import { CloudStorageService } from './cloudStorage.service';
import { NotificationService } from './notification.service';
import { CacheService } from './cache.service';
import { ApiError } from '../utils/ApiError';
import { Types } from 'mongoose';

export class StoryService {
  constructor(
    private cloudStorage: CloudStorageService,
    private notificationService: NotificationService,
    private cacheService: CacheService
  ) {}

  async createStory(userId: string, storyData: any, mediaFile: Express.Multer.File): Promise<IStory> {
    const mediaUrl = await this.cloudStorage.uploadMedia(mediaFile, 'stories');
    
    const story = await Story.create({
      user: userId,
      content: {
        type: mediaFile.mimetype.startsWith('image/') ? 'image' : 'video',
        url: mediaUrl,
        thumbnail: storyData.thumbnail
      },
      caption: storyData.caption,
      location: storyData.location
    });

    // Notifier les followers
    const user = await User.findById(userId);
    if (user?.followers?.length) {
      await this.notificationService.notifyMany(
        user.followers,
        'NEW_STORY',
        `${user.firstName} a ajouté une nouvelle story`
      );
    }

    await this.cacheService.invalidate(`stories:feed:${userId}`);
    return story;
  }

  async getFeed(userId: string): Promise<IStory[]> {
    const cacheKey = `stories:feed:${userId}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'Utilisateur non trouvé');

    const stories = await Story.find({
      user: { $in: [...user.following, userId] },
      expiresAt: { $gt: new Date() },
      isArchived: false
    })
    .populate('user', 'firstName lastName avatar')
    .sort('-createdAt');

    await this.cacheService.set(cacheKey, stories, 300); // 5 minutes
    return stories;
  }

  async viewStory(storyId: string, viewerId: string): Promise<void> {
    const story = await Story.findById(storyId);
    if (!story) throw new ApiError(404, 'Story non trouvée');

    if (!story.viewers.some(v => v.user.toString() === viewerId)) {
      story.viewers.push({
        user: new Types.ObjectId(viewerId),
        viewedAt: new Date()
      });
      await story.save();
    }
  }

  async cleanupExpiredStories(): Promise<void> {
    const expiredStories = await Story.find({
      expiresAt: { $lt: new Date() },
      isArchived: false
    });

    for (const story of expiredStories) {
      await this.cloudStorage.deleteMedia(story.content.url);
      if (story.content.thumbnail) {
        await this.cloudStorage.deleteMedia(story.content.thumbnail);
      }
      story.isArchived = true;
      await story.save();
    }
  }
} 