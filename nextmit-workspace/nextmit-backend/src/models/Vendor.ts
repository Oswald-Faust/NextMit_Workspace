import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  description: string;
  type: 'restaurant' | 'stand' | 'other';
  logo: string;
  images: string[];
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  manager: Schema.Types.ObjectId;
  events: Schema.Types.ObjectId[];
  menu?: {
    categories: [{
      name: string;
      items: [{
        name: string;
        description: string;
        price: number;
        image?: string;
      }];
    }];
  };
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['restaurant', 'stand', 'other'],
    required: true
  },
  logo: String,
  images: [String],
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: String
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  events: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  menu: {
    categories: [{
      name: String,
      items: [{
        name: String,
        description: String,
        price: Number,
        image: String
      }]
    }]
  }
}, {
  timestamps: true
});

export const Vendor = mongoose.model<IVendor>('Vendor', VendorSchema); 