import express from 'express';
import { VendorRequestController } from '../controllers/vendor-request.controller';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();
const vendorRequestController = new VendorRequestController();

// Routes protégées pour l'admin
router.use(protect);

// Routes pour l'admin
router.get(
  '/admin/events/:eventId/vendor-requests',
  restrictTo('admin'),
  vendorRequestController.getEventRequests
);

router.patch(
  '/admin/vendor-requests/:requestId/approve',
  restrictTo('admin'),
  vendorRequestController.approveRequest
);

router.patch(
  '/admin/vendor-requests/:requestId/reject',
  restrictTo('admin'),
  vendorRequestController.rejectRequest
);

// Routes pour les vendeurs
router.get(
  '/vendors/requests',
  restrictTo('vendor'),
  vendorRequestController.getVendorRequests
);

router.post(
  '/vendors/requests',
  restrictTo('vendor'),
  vendorRequestController.createRequest
);

export default router;
