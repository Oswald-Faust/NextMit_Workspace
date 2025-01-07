import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { catchAsync } from '../utils/catchAsync';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  getEvents = catchAsync(async (req: Request, res: Response) => {
    const events = await this.eventService.queryEvents(req.query);
    const eventsWithFullImageUrls = events.map(event => ({
      ...event.toObject(),
      image: event.image ? `/api/v1/${event.image}` : null
    }));
    res.json({
      success: true,
      data: eventsWithFullImageUrls
    });
  });

  getEvent = catchAsync(async (req: Request, res: Response) => {
    const event = await this.eventService.getEventById(req.params.eventId);
    const eventWithFullImageUrl = {
      ...event.toObject(),
      image: event.image ? `/api/v1/${event.image}` : null
    };
    res.json({
      success: true,
      data: eventWithFullImageUrl
    });
  });

  createEvent = catchAsync(async (req: Request, res: Response) => {
    const location = typeof req.body.location === 'string' 
      ? JSON.parse(req.body.location)
      : req.body.location;

    const eventData = {
      ...req.body,
      location,
      organizer: req.user.id,
      ...(req.file && { image: `uploads/events/${req.file.filename}` })
    };

    const event = await this.eventService.createEvent(eventData);
    const eventWithFullImageUrl = {
      ...event.toObject(),
      image: event.image ? `/api/v1/${event.image}` : null
    };
    
    res.status(201).json({
      success: true,
      data: eventWithFullImageUrl
    });
  });

  updateEvent = catchAsync(async (req: Request, res: Response) => {
    const location = typeof req.body.location === 'string' 
      ? JSON.parse(req.body.location)
      : req.body.location;

    const eventData = {
      ...req.body,
      location,
      ...(req.file && { image: `uploads/events/${req.file.filename}` })
    };

    const event = await this.eventService.updateEvent(
      req.params.eventId,
      eventData,
      req.user
    );

    const eventWithFullImageUrl = {
      ...event.toObject(),
      image: event.image ? `/api/v1/${event.image}` : null
    };

    res.json({
      success: true,
      data: eventWithFullImageUrl
    });
  });

  deleteEvent = catchAsync(async (req: Request, res: Response) => {
    await this.eventService.deleteEvent(req.params.eventId, req.user);
    res.status(204).send();
  });

  addVendor = catchAsync(async (req: Request, res: Response) => {
    const event = await this.eventService.addVendor(
      req.params.eventId,
      req.body.vendorId,
      req.user
    );

    res.json({
      success: true,
      data: event
    });
  });

  removeVendor = catchAsync(async (req: Request, res: Response) => {
    const event = await this.eventService.removeVendor(
      req.params.eventId,
      req.params.vendorId,
      req.user
    );

    res.json({
      success: true,
      data: event
    });
  });

  addAdvertisement = catchAsync(async (req: Request, res: Response) => {
    const event = await this.eventService.addAdvertisement(
      req.params.eventId,
      req.body,
      req.user
    );

    res.json({
      success: true,
      data: event
    });
  });
}