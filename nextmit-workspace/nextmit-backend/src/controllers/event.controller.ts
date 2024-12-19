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
    res.json({
      success: true,
      data: events
    });
  });

  getEvent = catchAsync(async (req: Request, res: Response) => {
    const event = await this.eventService.getEventById(req.params.eventId);
    res.json({
      success: true,
      data: event
    });
  });

  createEvent = catchAsync(async (req: Request, res: Response) => {
    const eventData = {
      ...req.body,
      organizer: req.user.id,
      ...(req.file && { image: req.file.path })
    };

    const event = await this.eventService.createEvent(eventData);
    res.status(201).json({
      success: true,
      data: event
    });
  });

  updateEvent = catchAsync(async (req: Request, res: Response) => {
    const eventData = {
      ...req.body,
      ...(req.file && { image: req.file.path })
    };

    const event = await this.eventService.updateEvent(
      req.params.eventId,
      eventData,
      req.user
    );

    res.json({
      success: true,
      data: event
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