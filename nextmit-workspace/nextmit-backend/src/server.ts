import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { connectDB } from './database';
import { errorHandler } from './middleware/error';
import { logger } from './config/logger';

// Routes
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'x-admin-access'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(config.port, '0.0.0.0', () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});

app.use((req, _res, next) => {
  logger.debug(`Requête reçue de ${req.ip} : ${req.method} ${req.url}`);
  logger.debug('Headers:', req.headers);
  next();
});

// API Routes
app.use(`${config.api.prefix}/auth`, authRoutes);
app.use(`${config.api.prefix}/events`, eventRoutes);
app.use(`${config.api.prefix}/admin`, adminRoutes);

// Health check
app.get('/health', (_req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'OK' });
});

// Test endpoint
app.get('/test', (_req: express.Request, res: express.Response) => {
  res.json({ message: 'Backend accessible' });
});

// Error handling
app.use(errorHandler);

// Handle 404
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    logger.info('MongoDB Connected...');

    app.listen(config.port, () => {
      logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app; 