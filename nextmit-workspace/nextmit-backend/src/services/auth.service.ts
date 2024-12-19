import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { config } from '../config';

export class AuthService {
  async createUser(userData: any) {
    return User.create(userData);
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }
    return user;
  }

  generateAuthTokens(user: any) {
    const accessToken = jwt.sign(
      { sub: user.id },
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpirationMinutes + 'm' }
    );

    const refreshToken = jwt.sign(
      { sub: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpirationDays + 'd' }
    );

    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }

  async refreshAuth(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, config.jwt.refreshSecret);
      const user = await User.findById(payload.sub);
      if (!user) {
        throw new ApiError(401, 'User not found');
      }
      return this.generateAuthTokens(user);
    } catch (error) {
      throw new ApiError(401, 'Invalid refresh token');
    }
  }

  generateVerificationToken(user: any) {
    return jwt.sign(
      { sub: user.id },
      config.jwt.verificationSecret,
      { expiresIn: '1d' }
    );
  }

  // ... autres méthodes
} 