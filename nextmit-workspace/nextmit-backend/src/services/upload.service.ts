import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../middleware/error';
import { logger } from '../config/logger';

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class UploadService {
  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      // Convertir le fichier en base64
      const base64File = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      // Upload vers Cloudinary
      const result = await cloudinary.uploader.upload(base64File, {
        folder: `nextmit/${folder}`,
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      });

      return result.secure_url;
    } catch (error) {
      logger.error('Erreur lors de l\'upload de l\'image:', error);
      throw new AppError('Erreur lors de l\'upload de l\'image', 500);
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extraire l'ID public de l'URL Cloudinary
      const publicId = imageUrl
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0];

      await cloudinary.uploader.destroy(`nextmit/${publicId}`);
    } catch (error) {
      logger.error('Erreur lors de la suppression de l\'image:', error);
      throw new AppError('Erreur lors de la suppression de l\'image', 500);
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, folder));
      return await Promise.all(uploadPromises);
    } catch (error) {
      logger.error('Erreur lors de l\'upload multiple d\'images:', error);
      throw new AppError('Erreur lors de l\'upload multiple d\'images', 500);
    }
  }

  async optimizeImage(imageUrl: string, options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {}): Promise<string> {
    try {
      const { width = 800, height = 600, quality = 80 } = options;

      const result = await cloudinary.uploader.upload(imageUrl, {
        transformation: [
          { width, height, crop: 'limit' },
          { quality },
          { fetch_format: 'auto' },
        ],
      });

      return result.secure_url;
    } catch (error) {
      logger.error('Erreur lors de l\'optimisation de l\'image:', error);
      throw new AppError('Erreur lors de l\'optimisation de l\'image', 500);
    }
  }
}

export const uploadService = new UploadService(); 