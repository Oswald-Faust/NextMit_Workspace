import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: {
    address?: string;
    city?: string;
    coordinates?: [number, number];
  };
  image?: string;
  organizer: Types.ObjectId;
  vendors?: Types.ObjectId[];
  advertisements?: Types.ObjectId[];
  capacity: number;
  price: number;
  type: string;
  status: 'draft' | 'published' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema({
  address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  coordinates: {
    type: [Number],
    required: false
  }
}, { _id: false });

const eventSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  endDate: {
    type: Date,
    required: [true, 'La date de fin est requise']
  },
  location: {
    type: locationSchema,
    required: false,
    default: {}
  },
  image: {
    type: String,
    required: false
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
    required: [true, 'La capacité est requise'],
    min: [1, 'La capacité doit être supérieure à 0']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  type: {
    type: String,
    required: [true, 'Le type est requis']
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