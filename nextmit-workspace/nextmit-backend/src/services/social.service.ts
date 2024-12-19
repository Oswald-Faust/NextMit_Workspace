import { User, IUser } from '../models/User';
import { FriendRequest } from '../models/FriendRequest';
import { Message } from '../models/Message';
import { NotificationService } from './notification.service';
import { CacheService } from './cache.service';
import { ApiError } from '../utils/ApiError';

export class SocialService {
  constructor(
    private notificationService: NotificationService,
    private cacheService: CacheService
  ) {}

  async sendFriendRequest(senderId: string, receiverId: string): Promise<void> {
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);

    if (!sender || !receiver) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    // Vérifier si une demande existe déjà
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });

    if (existingRequest) {
      throw new ApiError(400, 'Une demande d\'ami est déjà en attente');
    }

    await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });

    await this.notificationService.notify(
      receiverId,
      'FRIEND_REQUEST',
      `${sender.firstName} vous a envoyé une demande d'ami`
    );
  }

  async acceptFriendRequest(requestId: string, userId: string): Promise<void> {
    const request = await FriendRequest.findById(requestId);
    if (!request || request.receiver.toString() !== userId) {
      throw new ApiError(404, 'Demande non trouvée');
    }

    const [sender, receiver] = await Promise.all([
      User.findById(request.sender),
      User.findById(request.receiver)
    ]);

    if (!sender || !receiver) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    // Mettre à jour les relations
    await Promise.all([
      User.findByIdAndUpdate(sender._id, { $addToSet: { friends: receiver._id, following: receiver._id } }),
      User.findByIdAndUpdate(receiver._id, { $addToSet: { friends: sender._id, following: sender._id } })
    ]);

    request.status = 'accepted';
    await request.save();

    await this.notificationService.notify(
      sender._id,
      'FRIEND_REQUEST_ACCEPTED',
      `${receiver.firstName} a accepté votre demande d'ami`
    );
  }

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<void> {
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);

    if (!sender || !receiver) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    // Vérifier si les utilisateurs sont amis
    if (!sender.friends.includes(receiverId)) {
      throw new ApiError(403, 'Vous devez être amis pour envoyer un message');
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      read: false
    });

    await this.notificationService.notify(
      receiverId,
      'NEW_MESSAGE',
      `Nouveau message de ${sender.firstName}`
    );

    // Invalider le cache des conversations
    await this.cacheService.invalidate(`conversations:${senderId}`);
    await this.cacheService.invalidate(`conversations:${receiverId}`);
  }

  async getConversation(userId: string, friendId: string): Promise<any> {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId }
      ]
    })
    .sort('createdAt')
    .populate('sender', 'firstName lastName avatar');

    // Marquer les messages comme lus
    await Message.updateMany(
      { sender: friendId, receiver: userId, read: false },
      { read: true }
    );

    return messages;
  }

  async getFriendsList(userId: string): Promise<IUser[]> {
    const user = await User.findById(userId)
      .populate('friends', 'firstName lastName avatar')
      .select('friends');

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    return user.friends;
  }

  async getPendingRequests(userId: string) {
    const requests = await FriendRequest.find({
      receiver: userId,
      status: 'pending'
    })
    .populate('sender', 'firstName lastName avatar')
    .sort('-createdAt');

    return requests;
  }

  async rejectFriendRequest(requestId: string, userId: string): Promise<void> {
    const request = await FriendRequest.findById(requestId);
    if (!request || request.receiver.toString() !== userId) {
      throw new ApiError(404, 'Demande non trouvée');
    }

    request.status = 'rejected';
    await request.save();

    await this.notificationService.notify(
      request.sender,
      'FRIEND_REQUEST_REJECTED',
      'Votre demande d\'ami a été rejetée'
    );
  }

  async followUser(followerId: string, targetId: string): Promise<void> {
    const [follower, target] = await Promise.all([
      User.findById(followerId),
      User.findById(targetId)
    ]);

    if (!follower || !target) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    if (follower.following.includes(targetId)) {
      throw new ApiError(400, 'Vous suivez déjà cet utilisateur');
    }

    await Promise.all([
      User.findByIdAndUpdate(followerId, {
        $addToSet: { following: targetId }
      }),
      User.findByIdAndUpdate(targetId, {
        $addToSet: { followers: followerId }
      })
    ]);

    await this.notificationService.notify(
      targetId,
      'NEW_FOLLOWER',
      `${follower.firstName} a commencé à vous suivre`
    );
  }

  async unfollowUser(followerId: string, targetId: string): Promise<void> {
    await Promise.all([
      User.findByIdAndUpdate(followerId, {
        $pull: { following: targetId }
      }),
      User.findByIdAndUpdate(targetId, {
        $pull: { followers: followerId }
      })
    ]);
  }

  async getConversations(userId: string) {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$receiver', userId] },
                  { $eq: ['$read', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            avatar: 1
          },
          lastMessage: 1,
          unreadCount: 1
        }
      }
    ]);

    return conversations;
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    const message = await Message.findOne({
      _id: messageId,
      receiver: userId,
      read: false
    });

    if (!message) {
      throw new ApiError(404, 'Message non trouvé');
    }

    message.read = true;
    message.readAt = new Date();
    await message.save();

    await this.cacheService.invalidate(`conversations:${userId}`);
  }
} 