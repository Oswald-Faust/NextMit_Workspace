import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description: string;
  type: string;
  location: string;
  startDate: Date;
  endDate: Date;
  price: number;
  capacity: number;
  imageUrl: string;
  status: 'draft' | 'published' | 'cancelled';
  tickets: {
    type: string;
    price: number;
    quantity: number;
    sold: number;
  }[];
  organizer: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
  },
  type: {
    type: String,
    required: [true, 'Le type est requis'],
    enum: ['food', 'drink', 'music', 'art', 'other'],
  },
  location: {
    type: String,
    required: [true, 'Le lieu est requis'],
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise'],
  },
  endDate: {
    type: Date,
    required: [true, 'La date de fin est requise'],
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif'],
  },
  capacity: {
    type: Number,
    required: [true, 'La capacité est requise'],
    min: [1, 'La capacité doit être d\'au moins 1'],
  },
  imageUrl: {
    type: String,
    required: [true, 'L\'image est requise'],
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled'],
    default: 'draft',
  },
  tickets: [{
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
  }],
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Index pour la recherche
eventSchema.index({ name: 'text', description: 'text' });

// Index pour le filtrage par date
eventSchema.index({ startDate: 1, endDate: 1 });

// Méthodes virtuelles
eventSchema.virtual('isLive').get(function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
});

eventSchema.virtual('remainingCapacity').get(function() {
  return this.capacity - this.participants.length;
});

export const Event = mongoose.model<IEvent>('Event', eventSchema); 