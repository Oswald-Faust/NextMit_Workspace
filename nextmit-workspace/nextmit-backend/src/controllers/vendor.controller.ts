import { Request, Response } from 'express';
import { VendorService } from '../services/vendor.service';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';

export class VendorController {
  private vendorService: VendorService;

  constructor() {
    this.vendorService = new VendorService();
  }

  getVendors = catchAsync(async (req: Request, res: Response) => {
    const filters = req.query;
    const vendors = await this.vendorService.queryVendors(filters);
    res.json({
      success: true,
      data: {
        items: vendors,
        total: vendors.length
      }
    });
  });

  getVendor = catchAsync(async (req: Request, res: Response) => {
    const vendor = await this.vendorService.getVendorById(req.params.vendorId);
    res.json({
      success: true,
      data: vendor
    });
  });

  createVendor = catchAsync(async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const vendorData = {
      ...req.body,
      manager: req.user.id,
      ...(files.logo && { logo: files.logo[0].path }),
      ...(files.images && { images: files.images.map(file => file.path) })
    };

    const vendor = await this.vendorService.createVendor(vendorData);
    res.status(201).json({
      success: true,
      data: vendor
    });
  });

  updateVendor = catchAsync(async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const vendorData = {
      ...req.body,
      ...(files.logo && { logo: files.logo[0].path }),
      ...(files.images && { images: files.images.map(file => file.path) })
    };

    const vendor = await this.vendorService.updateVendor(
      req.params.vendorId,
      vendorData,
      req.user
    );

    res.json({
      success: true,
      data: vendor
    });
  });

  deleteVendor = catchAsync(async (req: Request, res: Response) => {
    await this.vendorService.deleteVendor(req.params.vendorId, req.user);
    res.status(204).send();
  });

  // Gestion du menu
  addMenuCategory = catchAsync(async (req: Request, res: Response) => {
    const vendor = await this.vendorService.addMenuCategory(
      req.params.vendorId,
      req.body,
      req.user
    );

    res.json({
      success: true,
      data: vendor
    });
  });

  updateMenuCategory = catchAsync(async (req: Request, res: Response) => {
    const vendor = await this.vendorService.updateMenuCategory(
      req.params.vendorId,
      req.params.categoryId,
      req.body,
      req.user
    );

    res.json({
      success: true,
      data: vendor
    });
  });

  deleteMenuCategory = catchAsync(async (req: Request, res: Response) => {
    const vendor = await this.vendorService.deleteMenuCategory(
      req.params.vendorId,
      req.params.categoryId,
      req.user
    );

    res.json({
      success: true,
      data: vendor
    });
  });

  addMenuItem = catchAsync(async (req: Request, res: Response) => {
    const itemData = {
      ...req.body,
      ...(req.file && { image: req.file.path })
    };

    const vendor = await this.vendorService.addMenuItem(
      req.params.vendorId,
      req.params.categoryId,
      itemData,
      req.user
    );

    res.json({
      success: true,
      data: vendor
    });
  });

  updateMenuItem = catchAsync(async (req: Request, res: Response) => {
    const itemData = {
      ...req.body,
      ...(req.file && { image: req.file.path })
    };

    const vendor = await this.vendorService.updateMenuItem(
      req.params.vendorId,
      req.params.categoryId,
      req.params.itemId,
      itemData,
      req.user
    );

    res.json({
      success: true,
      data: vendor
    });
  });

  deleteMenuItem = catchAsync(async (req: Request, res: Response) => {
    const vendor = await this.vendorService.deleteMenuItem(
      req.params.vendorId,
      req.params.categoryId,
      req.params.itemId,
      req.user
    );

    res.json({
      success: true,
      data: vendor
    });
  });
} 