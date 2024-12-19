import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller';
import { auth } from '../middleware/auth';
import { vendorValidation } from '../validations/vendor.validation';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new VendorController();

// Routes publiques
router.get('/', vendorValidation.getVendors, controller.getVendors);
router.get('/:vendorId', vendorValidation.getVendor, controller.getVendor);

// Routes protégées (manager/admin)
router.post(
  '/',
  auth(['admin', 'manager']),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  vendorValidation.createVendor,
  controller.createVendor
);

router.patch(
  '/:vendorId',
  auth(['admin', 'manager']),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  vendorValidation.updateVendor,
  controller.updateVendor
);

router.delete(
  '/:vendorId',
  auth(['admin', 'manager']),
  vendorValidation.deleteVendor,
  controller.deleteVendor
);

// Gestion du menu
router.post(
  '/:vendorId/menu/categories',
  auth(['admin', 'manager']),
  vendorValidation.addMenuCategory,
  controller.addMenuCategory
);

router.patch(
  '/:vendorId/menu/categories/:categoryId',
  auth(['admin', 'manager']),
  vendorValidation.updateMenuCategory,
  controller.updateMenuCategory
);

router.delete(
  '/:vendorId/menu/categories/:categoryId',
  auth(['admin', 'manager']),
  controller.deleteMenuCategory
);

router.post(
  '/:vendorId/menu/categories/:categoryId/items',
  auth(['admin', 'manager']),
  upload.single('image'),
  vendorValidation.addMenuItem,
  controller.addMenuItem
);

router.patch(
  '/:vendorId/menu/categories/:categoryId/items/:itemId',
  auth(['admin', 'manager']),
  upload.single('image'),
  vendorValidation.updateMenuItem,
  controller.updateMenuItem
);

router.delete(
  '/:vendorId/menu/categories/:categoryId/items/:itemId',
  auth(['admin', 'manager']),
  controller.deleteMenuItem
);

export default router; 