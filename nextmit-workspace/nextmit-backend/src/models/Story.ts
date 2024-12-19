import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
  user: Schema.Types.ObjectId;
  content: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
  caption?: string;
  location?: string;
  viewers: [{
    user: Schema.Types.ObjectId;
    viewedAt: Date;
  }];
  isArchived: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: { type: String, required: true },
    thumbnail: String
  },
  caption: String,
  location: String,
  viewers: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: { type: Date, default: Date.now }
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 24*60*60*1000) // 24 heures
  }
}, {
  timestamps: true
});

// Index pour la suppression automatique des stories expirées
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Story = mongoose.model<IStory>('Story', StorySchema);
//export const Event = mongoose.model<IEvent>('Event', eventSchema); 