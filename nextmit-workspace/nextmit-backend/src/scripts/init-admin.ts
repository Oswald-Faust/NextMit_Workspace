import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { User } from '../models/User';

const adminData = {
  firstName: 'Admin',
  lastName: 'System',
  email: 'admin@nextmit.com',
  password: 'Admin@2024',
  phone: '+33600000000',
  role: 'admin',
  isVerified: true,
  profileImage: undefined,
  createdAt: new Date(),
  updatedAt: new Date()
};

async function initAdmin() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connecté à MongoDB');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('L\'administrateur existe déjà');
      return;
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Créer l'admin avec le schéma correct
    const admin = new User({
      ...adminData,
      password: hashedPassword,
      role: 'super_admin'
    });

    await admin.save();
    console.log('Administrateur créé avec succès');
    console.log('Email:', adminData.email);
    console.log('Mot de passe:', adminData.password);

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initAdmin(); 