const Gallery = require('../models/Gallery');

class GalleryRepository {
  /**
   * Find gallery item by ID
   */
  async findById(id) {
    return Gallery.findById(id);
  }

  /**
   * Query gallery items with pagination, filtering and search
   */
  async findWithFilters(filters = {}) {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search, 
      status, 
      mediaType,
      isDeleted = false
    } = filters;
    
    const query = { isDeleted };

    if (mediaType) {
      query.mediaType = mediaType;
    }
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const parsedLimit = Number(limit);
    const parsedPage = Number(page);

    const total = await Gallery.countDocuments(query);
    const items = await Gallery.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    return { 
      items, 
      total, 
      page: parsedPage, 
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit)
    };
  }

  /**
   * Create new gallery record
   */
  async create(data) {
    const galleryItem = new Gallery(data);
    return galleryItem.save();
  }

  /**
   * Update gallery record fields
   */
  async update(id, updateData) {
    return Gallery.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  /**
   * Soft delete a record
   */
  async softDelete(id, operator = 'admin') {
    return Gallery.findByIdAndUpdate(id, {
      $set: { isDeleted: true, deletedAt: new Date() },
      $push: { logs: { action: 'soft_delete', timestamp: new Date(), operator } }
    }, { new: true });
  }

  /**
   * Restore a soft deleted record
   */
  async restore(id, operator = 'admin') {
    return Gallery.findByIdAndUpdate(id, {
      $set: { isDeleted: false, deletedAt: null },
      $push: { logs: { action: 'restore', timestamp: new Date(), operator } }
    }, { new: true });
  }

  /**
   * Permanently delete a record
   */
  async deletePermanently(id) {
    return Gallery.findByIdAndDelete(id);
  }

  /**
   * Bulk publish records
   */
  async bulkPublish(ids, operator = 'admin') {
    return Gallery.updateMany(
      { _id: { $in: ids } },
      { 
        $set: { status: 'published' },
        $push: { logs: { action: 'publish', timestamp: new Date(), operator } }
      }
    );
  }

  /**
   * Bulk soft delete records
   */
  async bulkSoftDelete(ids, operator = 'admin') {
    return Gallery.updateMany(
      { _id: { $in: ids } },
      { 
        $set: { isDeleted: true, deletedAt: new Date() },
        $push: { logs: { action: 'soft_delete', timestamp: new Date(), operator } }
      }
    );
  }

  /**
   * Bulk restore records
   */
  async bulkRestore(ids, operator = 'admin') {
    return Gallery.updateMany(
      { _id: { $in: ids } },
      { 
        $set: { isDeleted: false, deletedAt: null },
        $push: { logs: { action: 'restore', timestamp: new Date(), operator } }
      }
    );
  }

  /**
   * Bulk permanent delete records
   */
  async bulkDeletePermanently(ids) {
    return Gallery.deleteMany({ _id: { $in: ids } });
  }
}

module.exports = new GalleryRepository();
