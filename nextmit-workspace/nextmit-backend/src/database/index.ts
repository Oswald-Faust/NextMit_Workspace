import mongoose from 'mongoose';
import { config } from '../config';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connecté avec succès');
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

mongoose.connection.on('error', (error) => {
  console.error('Erreur MongoDB:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB déconnecté');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
}); 