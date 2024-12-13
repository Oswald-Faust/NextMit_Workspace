import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
  event: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: string;
  price: number;
  quantity: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'used';
  paymentId?: string;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: [true, 'Le type de ticket est requis'],
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif'],
  },
  quantity: {
    type: Number,
    required: [true, 'La quantité est requise'],
    min: [1, 'La quantité doit être d\'au moins 1'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'used'],
    default: 'pending',
  },
  paymentId: String,
  qrCode: String,
}, {
  timestamps: true,
});

// Index pour la recherche rapide
ticketSchema.index({ event: 1, user: 1 });
ticketSchema.index({ status: 1 });

// Méthodes virtuelles
ticketSchema.virtual('totalPrice').get(function() {
  return this.price * this.quantity;
});

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema); 