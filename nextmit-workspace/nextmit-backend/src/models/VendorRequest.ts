import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorRequest extends Document {
  vendor: Schema.Types.ObjectId;
  event: Schema.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  responseMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VendorRequestSchema = new Schema({
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: [true, 'Le vendeur est requis']
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, "L'événement est requis"]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true
  },
  responseMessage: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexer pour des recherches rapides
VendorRequestSchema.index({ vendor: 1, event: 1 }, { unique: true });
VendorRequestSchema.index({ status: 1 });

export default mongoose.model<IVendorRequest>('VendorRequest', VendorRequestSchema);
