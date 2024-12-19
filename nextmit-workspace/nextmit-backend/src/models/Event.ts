import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: {
    address: string;
    city: string;
    coordinates?: [number, number];
  };
  image?: string;
  organizer: Types.ObjectId;
  vendors: Types.ObjectId[];
  advertisements: Types.ObjectId[];
  capacity: number;
  price: number;
  category: string;
  status: 'draft' | 'published' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  image: {
    type: String
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendors: [{
    type: Schema.Types.ObjectId,
    ref: 'Vendor'
  }],
  advertisements: [{
    type: Schema.Types.ObjectId,
    ref: 'Advertisement'
  }],
  capacity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled'],
    default: 'draft'
  }
}, {
  timestamps: true
});

export const Event = mongoose.model<IEvent>('Event', eventSchema); 
//export const User = mongoose.model<IUser>('User', UserSchema); 