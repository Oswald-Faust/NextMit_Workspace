import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AuthService } from '../services/auth.service';
//import { EmailService } from '../services/email.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../middleware/error';
import { logger } from '../config/logger';
import { config } from '../config';

export class AuthController {
  private authService: AuthService;
  //private emailService: EmailService;

  constructor() {
    this.authService = new AuthService();
   // this.emailService = new EmailService();
  }

  private generateToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role },
      config.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  register = catchAsync(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, phone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Cet email est déjà utilisé', 400);
    }

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    // Générer le token
    const token = this.generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    logger.debug('Données reçues:', { email, password });

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    logger.debug('Utilisateur trouvé:', { email: user?.email, hasPassword: !!user?.password });

    if (!user) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    logger.debug('Résultat comparaison mot de passe:', isPasswordValid);

    if (!isPasswordValid) {
      logger.debug('Mot de passe incorrect pour:', email);
      throw new AppError('Email ou mot de passe incorrect', 401);
    }

    // Générer le token
    const token = this.generateToken(user._id, user.role);
    logger.debug('Connexion réussie pour:', email);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  });

  getMe = catchAsync(async (req: Request, res: Response) => {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  updateProfile = catchAsync(async (req: Request, res: Response) => {
    const { firstName, lastName, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  updatePassword = catchAsync(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Mot de passe actuel incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    const token = this.generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
    });
  });

  refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new AppError('Refresh token requis', 400);
    }

    const tokens = await this.authService.refreshAuth(refreshToken);

    res.json({
      success: true,
      data: { tokens }
    });
  });

  logout = catchAsync(async (req: Request, res: Response) => {
    // Si vous utilisez des tokens de rafraîchissement stockés en base de données
    // vous pouvez les invalider ici
    
    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  });

  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError('Aucun utilisateur trouvé avec cet email', 404);
    }

    // Générer un token de réinitialisation
    const resetToken = this.authService.generateVerificationToken(user);
    
    // Envoyer l'email
  //  await this.emailService.sendResetPasswordEmail(user.email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Email de réinitialisation envoyé'
    });
  });

  resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { token, password } = req.body;

    // Vérifier le token et obtenir l'utilisateur
    const decoded = jwt.verify(token, config.jwtSecret) as { sub: string };
    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new AppError('Token invalide ou expiré', 400);
    }

    // Mettre à jour le mot de passe
    user.password = password;
    await user.save();

    // Générer de nouveaux tokens
    const newToken = this.generateToken(user._id, user.role);

    res.json({
      success: true,
      token: newToken
    });
  });

  verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const { token } = req.body;

    // Vérifier le token et obtenir l'utilisateur
    const decoded = jwt.verify(token, config.jwtSecret) as { sub: string };
    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new AppError('Token invalide ou expiré', 400);
    }

    // Marquer l'email comme vérifié
    user.isVerified = true;
    await user.save();

    res.json({
      success: true,
      message: 'Email vérifié avec succès'
    });
  });
} 