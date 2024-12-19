import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin' | 'manager' | 'super_admin';  // Ajout de 'super_admin
  isVerified: boolean;
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      weekly: boolean;
    };
    language: string;
    theme: string;
  };
  stories: [{
    type: Schema.Types.ObjectId,
    ref: 'Story'
  }];
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }];
  friends: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  pendingFriendRequests: [{
    from: Schema.Types.ObjectId;
    createdAt: Date;
  }];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  avatar: String,
  bio: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'manager', 'super_admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      weekly: { type: Boolean, default: false }
    },
    language: { type: String, default: 'fr' },
    theme: { type: String, default: 'light' }
  },
  stories: [{
    type: Schema.Types.ObjectId,
    ref: 'Story'
  }],
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  pendingFriendRequests: [{
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema); 