import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvertisement extends Document {
  title: string;
  description: string;
  type: 'banner' | 'popup' | 'story' | 'feed';
  content: {
    media: {
      type: 'image' | 'video';
      url: string;
      thumbnail?: string;
    };
    cta?: {
      text: string;
      url: string;
    };
  };
  targeting: {
    locations?: string[];
    ageRange?: {
      min: number;
      max: number;
    };
    interests?: string[];
    events?: Schema.Types.ObjectId[];
  };
  schedule: {
    startDate: Date;
    endDate: Date;
    showTimes?: {
      start: string; // Format "HH:mm"
      end: string;   // Format "HH:mm"
    }[];
  };
  metrics: {
    views: number;
    clicks: number;
    engagement: number;
  };
  status: 'draft' | 'active' | 'paused' | 'completed';
  advertiser: Schema.Types.ObjectId;
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AdvertisementSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['banner', 'popup', 'story', 'feed'],
    required: true
  },
  content: {
    media: {
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true
      },
      url: { type: String, required: true },
      thumbnail: String
    },
    cta: {
      text: String,
      url: String
    }
  },
  targeting: {
    locations: [String],
    ageRange: {
      min: Number,
      max: Number
    },
    interests: [String],
    events: [{
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }]
  },
  schedule: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    showTimes: [{
      start: String,
      end: String
    }]
  },
  metrics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed'],
    default: 'draft'
  },
  advertiser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  budget: {
    total: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    currency: { type: String, default: 'EUR' }
  }
}, {
  timestamps: true
});

export const Advertisement = mongoose.model<IAdvertisement>('Advertisement', AdvertisementSchema); 
//export const Event = mongoose.model<IEvent>('Event', eventSchema); 