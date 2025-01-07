import { Types } from 'mongoose';
import { Event, IEvent } from '../models/Event';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../models/User';
import { uploadService } from './upload.service';

export class EventService {
  async queryEvents(filters: any) {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.startDate) {
      query.startDate = { $gte: new Date(filters.startDate) };
    }

    if (filters.endDate) {
      query.endDate = { $lte: new Date(filters.endDate) };
    }

    if (filters.location) {
      query['location.city'] = filters.location;
    }

    return Event.find(query)
      .populate('organizer', 'firstName lastName')
      .sort({ startDate: 1 });
  }

  async getEventById(eventId: string) {
    return Event.findById(eventId)
      .populate('organizer', 'firstName lastName')
      .populate('vendors')
      .populate('advertisements');
  }

  async createEvent(eventData: any) {
    // Traitement des données du formulaire
    const processedData = {
      title: eventData.title,
      description: eventData.description,
      startDate: new Date(eventData.startDate),
      endDate: new Date(eventData.endDate),
      location: {
        address: eventData.address,
        city: eventData.city
      },
      capacity: Number(eventData.capacity),
      price: Number(eventData.price),
      type: eventData.type,
      status: eventData.status || 'draft',
      organizer: eventData.organizer || eventData.createdBy,
      image: eventData.image
    };

    return Event.create(processedData);
  }

  async updateEvent(eventId: string, eventData: any, user: IUser) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // Vérifier si l'utilisateur est l'organisateur ou un admin
    if (!event.organizer.equals(user._id) && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to update this event');
    }

    // Traitement des données du formulaire
    const processedData = {
      title: eventData.title,
      description: eventData.description,
      startDate: eventData.startDate ? new Date(eventData.startDate) : event.startDate,
      endDate: eventData.endDate ? new Date(eventData.endDate) : event.endDate,
      location: {
        address: eventData.address || event.location.address,
        city: eventData.city || event.location.city
      },
      capacity: eventData.capacity ? Number(eventData.capacity) : event.capacity,
      price: eventData.price ? Number(eventData.price) : event.price,
      type: eventData.type || event.type,
      status: eventData.status || event.status,
      ...(eventData.image && { image: eventData.image })
    };

    return Event.findByIdAndUpdate(eventId, processedData, {
      new: true,
      runValidators: true
    });
  }

  async deleteEvent(eventId: string, user: IUser) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // Vérifier si l'utilisateur est l'organisateur ou un admin
    if (!event.organizer.equals(user._id) && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to delete this event');
    }

    await event.deleteOne();
  }

  async addVendor(eventId: string, vendorId: string, user: IUser) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (!event.organizer.equals(user._id) && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to add vendors to this event');
    }

    if (!event.vendors.includes(new Types.ObjectId(vendorId))) {
      event.vendors.push(new Types.ObjectId(vendorId));
      await event.save();
    }

    return event;
  }

  async removeVendor(eventId: string, vendorId: string, user: IUser) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (!event.organizer.equals(user._id) && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to remove vendors from this event');
    }

    event.vendors = event.vendors.filter(id => !id.equals(vendorId));
    await event.save();

    return event;
  }

  async getEventAdvertisements(eventId: string) {
    const event = await Event.findById(eventId).populate('advertisements');
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }
    return event.advertisements;
  }

  async addAdvertisement(eventId: string, advertisementData: any, user: IUser) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Événement non trouvé');
    }

    // Vérifier les permissions
    if (event.organizer.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Non autorisé à modifier cet événement');
    }

    const advertisementId = new Types.ObjectId();
    event.advertisements.push(advertisementId);
    await event.save();

    return event;
  }
}