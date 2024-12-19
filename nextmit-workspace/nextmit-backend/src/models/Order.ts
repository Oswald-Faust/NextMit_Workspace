import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  vendor: Schema.Types.ObjectId;
  event: Schema.Types.ObjectId;
  items: [{
    name: string;
    quantity: number;
    price: number;
    notes?: string;
    options?: {
      name: string;
      value: string;
      price?: number;
    }[];
  }];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  payment: {
    method: 'card' | 'cash' | 'mobile';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    amount: number;
    currency: string;
  };
  delivery: {
    type: 'pickup' | 'table';
    location?: string;
    notes?: string;
    estimatedTime?: Date;
  };
  subtotal: number;
  tax: number;
  total: number;
  rating?: {
    score: number;
    comment?: string;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    notes: String,
    options: [{
      name: String,
      value: String,
      price: Number
    }]
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'cash', 'mobile'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    amount: { type: Number, required: true },
    currency: { type: String, default: 'EUR' }
  },
  delivery: {
    type: {
      type: String,
      enum: ['pickup', 'table'],
      required: true
    },
    location: String,
    notes: String,
    estimatedTime: Date
  },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Index pour les recherches fréquentes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ vendor: 1, status: 1 });
OrderSchema.index({ event: 1 });

export default mongoose.model<IOrder>('Order', OrderSchema); 