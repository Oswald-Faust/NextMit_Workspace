import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: Schema.Types.ObjectId;
  type: 'FRIEND_REQUEST' | 'FRIEND_REQUEST_ACCEPTED' | 'FRIEND_REQUEST_REJECTED' | 
        'NEW_MESSAGE' | 'NEW_FOLLOWER' | 'NEW_STORY' | 'EVENT_REMINDER' | 'SYSTEM';
  message: string;
  data?: any;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'FRIEND_REQUEST',
      'FRIEND_REQUEST_ACCEPTED',
      'FRIEND_REQUEST_REJECTED',
      'NEW_MESSAGE',
      'NEW_FOLLOWER',
      'NEW_STORY',
      'EVENT_REMINDER',
      'SYSTEM'
    ],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: Schema.Types.Mixed,
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: Date
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ user: 1, read: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema); 