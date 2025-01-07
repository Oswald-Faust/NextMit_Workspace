import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import VendorRequest from '../models/VendorRequest';
import { Event } from '../models/Event';
import { Vendor } from '../models/Vendor'; 

export class VendorRequestController {
  // Obtenir toutes les demandes pour un événement
  getEventRequests = catchAsync(async (req: Request, res: Response) => {
    const requests = await VendorRequest.find({ event: req.params.eventId })
      .populate('vendor', 'name logo type')
      .sort('-createdAt');

    res.json({
      success: true,
      data: requests
    });
  });

  // Obtenir toutes les demandes d'un vendeur
  getVendorRequests = catchAsync(async (req: Request, res: Response) => {
    const requests = await VendorRequest.find({ vendor: req.params.vendorId })
      .populate('event', 'title startDate endDate')
      .sort('-createdAt');

    res.json({
      success: true,
      data: requests
    });
  });

  // Créer une nouvelle demande
  createRequest = catchAsync(async (req: Request, res: Response) => {
    const { eventId, message } = req.body;
    const vendorId = req.user.vendorId; // Supposons que l'ID du vendeur est stocké dans le token

    // Vérifier si une demande existe déjà
    const existingRequest = await VendorRequest.findOne({
      vendor: vendorId,
      event: eventId
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Une demande existe déjà pour cet événement'
      });
    }

    const request = await VendorRequest.create({
      vendor: vendorId,
      event: eventId,
      message
    });

    res.status(201).json({
      success: true,
      data: request
    });
  });

  // Approuver une demande
  approveRequest = catchAsync(async (req: Request, res: Response) => {
    const { requestId } = req.params;
    const { responseMessage } = req.body;

    const request = await VendorRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }

    // Mettre à jour la demande
    request.status = 'approved';
    request.responseMessage = responseMessage;
    await request.save();

    // Ajouter le vendeur à l'événement
    await Event.findByIdAndUpdate(request.event, {
      $addToSet: { vendors: request.vendor }
    });

    // Ajouter l'événement au vendeur
    await Vendor.findByIdAndUpdate(request.vendor, {
      $addToSet: { events: request.event }
    });

    res.json({
      success: true,
      data: request
    });
  });

  // Rejeter une demande
  rejectRequest = catchAsync(async (req: Request, res: Response) => {
    const { requestId } = req.params;
    const { responseMessage } = req.body;

    const request = await VendorRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }

    request.status = 'rejected';
    request.responseMessage = responseMessage;
    await request.save();

    res.json({
      success: true,
      data: request
    });
  });
}
