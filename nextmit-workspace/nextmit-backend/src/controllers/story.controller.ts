import { Request, Response } from 'express';
import { Story } from '../models/Story';
import { AppError } from '../middleware/error';
import { catchAsync } from '../utils/catchAsync';

export class StoryController {
  createStory = catchAsync(async (req: Request, res: Response) => {
    const { caption, location } = req.body;
    const mediaFile = req.file;

    if (!mediaFile) {
      throw new AppError('Le média est requis', 400);
    }

    const story = await Story.create({
      user: req.user.id,
      content: {
        type: mediaFile.mimetype.startsWith('image/') ? 'image' : 'video',
        url: mediaFile.path,
        thumbnail: mediaFile.mimetype.startsWith('video/') ? req.body.thumbnail : undefined
      },
      caption,
      location
    });

    res.status(201).json({
      success: true,
      data: story
    });
  });

  getMyStories = catchAsync(async (req: Request, res: Response) => {
    const stories = await Story.find({
      user: req.user.id,
      expiresAt: { $gt: new Date() }
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      data: stories
    });
  });

  getStoriesFeed = catchAsync(async (req: Request, res: Response) => {
    const stories = await Story.find({
      expiresAt: { $gt: new Date() },
      isArchived: false
    })
    .populate('user', 'firstName lastName avatar')
    .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: stories
    });
  });

  viewStory = catchAsync(async (req: Request, res: Response) => {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      throw new AppError('Story non trouvée', 404);
    }

    story.viewers.push({
      user: req.user.id,
      viewedAt: new Date()
    });

    await story.save();

    res.status(200).json({
      success: true,
      data: story
    });
  });

  archiveStory = catchAsync(async (req: Request, res: Response) => {
    const story = await Story.findOne({
      _id: req.params.storyId,
      user: req.user.id
    });

    if (!story) {
      throw new AppError('Story non trouvée', 404);
    }

    story.isArchived = true;
    await story.save();

    res.status(200).json({
      success: true,
      data: story
    });
  });

  deleteStory = catchAsync(async (req: Request, res: Response) => {
    const story = await Story.findOne({
      _id: req.params.storyId,
      user: req.user.id
    });

    if (!story) {
      throw new AppError('Story non trouvée', 404);
    }

    await story.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Story supprimée avec succès'
    });
  });
} 