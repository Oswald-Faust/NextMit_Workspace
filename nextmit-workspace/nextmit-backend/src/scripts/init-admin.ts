import mongoose from 'mongoose';
import { config } from '../config';
import { User } from '../models/User';

const adminData = {
  firstName: 'Admin',
  lastName: 'System',
  email: 'admin@nextmit.com',
  password: 'Admin@2024',
  phone: '+33600000000',
  role: 'admin',
  isVerified: true
};

async function initAdmin() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connecté à MongoDB');

    // Supprimer l'admin existant s'il existe
    await User.deleteOne({ email: adminData.email });
    console.log('Ancien admin supprimé');

    // Créer un nouvel admin
    const admin = new User(adminData);
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