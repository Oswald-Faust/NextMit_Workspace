import { Vendor } from '../models/Vendor';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../models/User';
import { UploadService } from './upload.service';

export class VendorService {
  private uploadService: UploadService;

  constructor() {
    this.uploadService = new UploadService();
  }

  async queryVendors(filters: any) {
    const query: any = {};

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.event) {
      query.events = filters.event;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    return Vendor.find(query)
      .populate('manager', 'firstName lastName email')
      .populate('events', 'title startDate endDate')
      .sort({ createdAt: -1 });
  }

  async getVendorById(vendorId: string) {
    const vendor = await Vendor.findById(vendorId)
      .populate('manager', 'firstName lastName email')
      .populate('events', 'title startDate endDate');

    if (!vendor) {
      throw new ApiError(404, 'Vendor not found');
    }

    return vendor;
  }

  async createVendor(vendorData: any) {
    // Upload des images si nécessaire
    if (vendorData.logo) {
      vendorData.logo = await this.uploadService.uploadFile(vendorData.logo);
    }

    if (vendorData.images && vendorData.images.length > 0) {
      vendorData.images = await Promise.all(
        vendorData.images.map((image: string) => this.uploadService.uploadFile(image))
      );
    }

    return Vendor.create(vendorData);
  }

  async updateVendor(vendorId: string, vendorData: any, user: IUser) {
    const vendor = await this.getVendorById(vendorId);

    if (vendor.manager.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to update this vendor');
    }

    // Upload des nouvelles images si nécessaire
    if (vendorData.logo) {
      // Supprimer l'ancienne image logo
      if (vendor.logo) {
        await this.uploadService.deleteFile(vendor.logo);
      }
      vendorData.logo = await this.uploadService.uploadFile(vendorData.logo);
    }

    if (vendorData.images && vendorData.images.length > 0) {
      // Supprimer les anciennes images
      if (vendor.images.length > 0) {
        await Promise.all(
          vendor.images.map(image => this.uploadService.deleteFile(image))
        );
      }
      vendorData.images = await Promise.all(
        vendorData.images.map((image: string) => this.uploadService.uploadFile(image))
      );
    }

    Object.assign(vendor, vendorData);
    await vendor.save();

    return vendor;
  }

  async deleteVendor(vendorId: string, user: IUser) {
    const vendor = await this.getVendorById(vendorId);

    if (vendor.manager.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to delete this vendor');
    }

    // Supprimer toutes les images associées
    if (vendor.logo) {
      await this.uploadService.deleteFile(vendor.logo);
    }

    if (vendor.images.length > 0) {
      await Promise.all(
        vendor.images.map(image => this.uploadService.deleteFile(image))
      );
    }

    await vendor.deleteOne();
  }

  // Gestion du menu
  async addMenuCategory(vendorId: string, categoryData: any, user: IUser) {
    const vendor = await this.getVendorById(vendorId);

    if (vendor.manager.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to modify this vendor');
    }

    vendor.menu = vendor.menu || { categories: [] };
    vendor.menu.categories.push(categoryData);
    await vendor.save();

    return vendor;
  }

  async updateMenuCategory(vendorId: string, categoryId: string, categoryData: any, user: IUser) {
    const vendor = await this.getVendorById(vendorId);

    if (vendor.manager.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to modify this vendor');
    }

    const categoryIndex = vendor.menu?.categories.findIndex(
      cat => cat._id.toString() === categoryId
    );

    if (categoryIndex === -1) {
      throw new ApiError(404, 'Category not found');
    }

    vendor.menu!.categories[categoryIndex] = {
      ...vendor.menu!.categories[categoryIndex],
      ...categoryData
    };

    await vendor.save();
    return vendor;
  }

  async deleteMenuCategory(vendorId: string, categoryId: string, user: IUser) {
    const vendor = await this.getVendorById(vendorId);

    if (vendor.manager.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to modify this vendor');
    }

    vendor.menu!.categories = vendor.menu!.categories.filter(
      cat => cat._id.toString() !== categoryId
    );

    await vendor.save();
    return vendor;
  }

  // Gestion des items du menu
  async addMenuItem(vendorId: string, categoryId: string, itemData: any, user: IUser) {
    const vendor = await this.getVendorById(vendorId);

    if (vendor.manager.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to modify this vendor');
    }

    if (itemData.image) {
      itemData.image = await this.uploadService.uploadFile(itemData.image);
    }

    const category = vendor.menu?.categories.find(
      cat => cat._id.toString() === categoryId
    );

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    category.items.push(itemData);
    await vendor.save();

    return vendor;
  }

  async updateMenuItem(
    vendorId: string,
    categoryId: string,
    itemId: string,
    itemData: any,
    user: IUser
  ) {
    const vendor = await this.getVendorById(vendorId);

    if (vendor.manager.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to modify this vendor');
    }

    const category = vendor.menu?.categories.find(
      cat => cat._id.toString() === categoryId
    );

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    const itemIndex = category.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      throw new ApiError(404, 'Item not found');
    }

    if (itemData.image) {
      // Supprimer l'ancienne image si elle existe
      if (category.items[itemIndex].image) {
        await this.uploadService.deleteFile(category.items[itemIndex].image);
      }
      itemData.image = await this.uploadService.uploadFile(itemData.image);
    }

    category.items[itemIndex] = {
      ...category.items[itemIndex],
      ...itemData
    };

    await vendor.save();
    return vendor;
  }

  async deleteMenuItem(
    vendorId: string,
    categoryId: string,
    itemId: string,
    user: IUser
  ) {
    const vendor = await this.getVendorById(vendorId);

    if (vendor.manager.toString() !== user.id && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to modify this vendor');
    }

    const category = vendor.menu?.categories.find(
      cat => cat._id.toString() === categoryId
    );

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    const item = category.items.find(item => item._id.toString() === itemId);

    if (item?.image) {
      await this.uploadService.deleteFile(item.image);
    }

    category.items = category.items.filter(
      item => item._id.toString() !== itemId
    );

    await vendor.save();
    return vendor;
  }
} 