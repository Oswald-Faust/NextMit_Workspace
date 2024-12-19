import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getProfile = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.user.id);
    res.json({
      success: true,
      data: user
    });
  });

  updateProfile = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.updateUser(req.user.id, req.body);
    res.json({
      success: true,
      data: user
    });
  });

  updatePassword = catchAsync(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    await this.userService.updatePassword(req.user.id, currentPassword, newPassword);
    res.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
  });

  updatePreferences = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.updatePreferences(req.user.id, req.body);
    res.json({
      success: true,
      data: user
    });
  });

  getUserStories = catchAsync(async (req: Request, res: Response) => {
    const stories = await this.userService.getUserStories(req.user.id);
    res.json({
      success: true,
      data: stories
    });
  });

  getUserOrders = catchAsync(async (req: Request, res: Response) => {
    const orders = await this.userService.getUserOrders(req.user.id);
    res.json({
      success: true,
      data: orders
    });
  });

  // Routes admin
  getUsers = catchAsync(async (req: Request, res: Response) => {
    const filters = req.query;
    const users = await this.userService.queryUsers(filters);
    res.json({
      success: true,
      data: {
        items: users,
        total: users.length
      }
    });
  });

  getUser = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }
    res.json({
      success: true,
      data: user
    });
  });

  updateUser = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.updateUser(req.params.userId, req.body);
    res.json({
      success: true,
      data: user
    });
  });

  deleteUser = catchAsync(async (req: Request, res: Response) => {
    await this.userService.deleteUser(req.params.userId);
    res.status(204).send();
  });
} 