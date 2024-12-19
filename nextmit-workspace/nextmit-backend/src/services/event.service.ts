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
    return Event.create(eventData);
  }

  async updateEvent(eventId: string, eventData: any, user: IUser) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (event.organizer.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to update this event');
    }

    Object.assign(event, eventData);
    await event.save();

    return event;
  }

  async deleteEvent(eventId: string, user: IUser) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (event.organizer.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to delete this event');
    }

    await event.deleteOne();
  }

  async addVendor(eventId: string, vendorId: string, user: IUser) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Événement non trouvé');
    }

    // Vérifier les permissions
    if (event.organizer.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Non autorisé à modifier cet événement');
    }

    const vendorObjectId = new Types.ObjectId(vendorId);

    // Vérifier si le vendeur est déjà ajouté
    if (event.vendors.some(v => v.toString() === vendorObjectId.toString())) {
      throw new ApiError(400, 'Ce vendeur est déjà ajouté à l\'événement');
    }

    event.vendors.push(vendorObjectId);
    await event.save();

    return event;
  }

  async removeVendor(eventId: string, vendorId: string, user: IUser) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Événement non trouvé');
    }

    // Vérifier les permissions
    if (event.organizer.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Non autorisé à modifier cet événement');
    }

    const vendorObjectId = new Types.ObjectId(vendorId);
    event.vendors = event.vendors.filter(
      v => v.toString() !== vendorObjectId.toString()
    );
    
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