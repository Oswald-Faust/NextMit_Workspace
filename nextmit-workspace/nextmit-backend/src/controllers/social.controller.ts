import { Request, Response } from 'express';
import { SocialService } from '../services/social.service';
import { catchAsync } from '../utils/catchAsync';

export class SocialController {
  private socialService: SocialService;

  constructor() {
    this.socialService = new SocialService(
      // Injecter les dépendances nécessaires
    );
  }

  sendFriendRequest = catchAsync(async (req: Request, res: Response) => {
    await this.socialService.sendFriendRequest(req.user.id, req.params.userId);
    res.status(200).json({
      success: true,
      message: 'Demande d\'ami envoyée'
    });
  });

  getPendingFriendRequests = catchAsync(async (req: Request, res: Response) => {
    const requests = await this.socialService.getPendingRequests(req.user.id);
    res.status(200).json({
      success: true,
      data: requests
    });
  });

  acceptFriendRequest = catchAsync(async (req: Request, res: Response) => {
    await this.socialService.acceptFriendRequest(req.params.requestId, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Demande d\'ami acceptée'
    });
  });

  rejectFriendRequest = catchAsync(async (req: Request, res: Response) => {
    await this.socialService.rejectFriendRequest(req.params.requestId, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Demande d\'ami rejetée'
    });
  });

  getFriendsList = catchAsync(async (req: Request, res: Response) => {
    const friends = await this.socialService.getFriendsList(req.user.id);
    res.status(200).json({
      success: true,
      data: friends
    });
  });

  followUser = catchAsync(async (req: Request, res: Response) => {
    await this.socialService.followUser(req.user.id, req.params.userId);
    res.status(200).json({
      success: true,
      message: 'Utilisateur suivi'
    });
  });

  unfollowUser = catchAsync(async (req: Request, res: Response) => {
    await this.socialService.unfollowUser(req.user.id, req.params.userId);
    res.status(200).json({
      success: true,
      message: 'Utilisateur non suivi'
    });
  });

  getConversations = catchAsync(async (req: Request, res: Response) => {
    const conversations = await this.socialService.getConversations(req.user.id);
    res.status(200).json({
      success: true,
      data: conversations
    });
  });

  sendMessage = catchAsync(async (req: Request, res: Response) => {
    await this.socialService.sendMessage(
      req.user.id,
      req.params.receiverId,
      req.body.content
    );
    res.status(201).json({
      success: true,
      message: 'Message envoyé'
    });
  });

  markMessageAsRead = catchAsync(async (req: Request, res: Response) => {
    await this.socialService.markMessageAsRead(req.params.messageId, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Message marqué comme lu'
    });
  });
} 