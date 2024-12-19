import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://Faust:Faust55@cluster0.r7fcj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-jwt-refresh-secret',
    verificationSecret: process.env.JWT_VERIFICATION_SECRET || 'your-jwt-verification-secret',
    accessExpirationMinutes: 30,
    refreshExpirationDays: 30,
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 2525,
      user: process.env.SMTP_USER || 'default_user',
      pass: process.env.SMTP_PASS || 'default_pass',
    },
    from: process.env.EMAIL_FROM || 'noreply@nextmit.com',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  api: {
    prefix: '/api/v1'
  }
}; 

export type Config = typeof config;