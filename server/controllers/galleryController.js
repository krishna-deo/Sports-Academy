const galleryRepository = require('../repositories/galleryRepository');
const galleryService = require('../services/galleryService');
const storageService = require('../services/storageService');
const fs = require('fs');

class GalleryController {
  /**
   * Public & Admin list querying with paginations and query filters
   */
  async getItems(req, res) {
    try {
      const filters = {
        page: req.query.page || 1,
        limit: req.query.limit || 12,
        category: req.query.category || null,
        mediaType: req.query.mediaType || null,
        search: req.query.search || null,
        status: req.query.status || 'published',
        isDeleted: req.query.isDeleted === 'true',
        featured: req.query.featured === 'true' ? true : undefined
      };

      const result = await galleryRepository.findWithFilters(filters);
      res.json(result);
    } catch (err) {
      console.error("Get gallery items query error:", err);
      res.status(500).json({ error: "Failed to query gallery items." });
    }
  }

  /**
   * Upload and Optimize single Media item
   */
  async uploadItem(req, res) {
    try {
      const { title, description, category, mediaType, featured, visibility, status } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "Media file upload is required." });
      }
      if (!title || !category || !mediaType) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({ error: "Title, category, and mediaType are required." });
      }

      // 1. Enforce file extensions and MIME-type restrictions
      try {
        galleryService.validateFile(file, mediaType);
      } catch (validationErr) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({ error: validationErr.message });
      }

      // 2. Execute optimization pipelines
      let optimizationResult;
      if (mediaType === 'image') {
        optimizationResult = await galleryService.optimizeImage(file.path, file.originalname);
      } else {
        const customThumb = req.files && req.files.thumbnail ? req.files.thumbnail[0] : null;
        optimizationResult = await galleryService.optimizeVideo(file.path, file.originalname, customThumb);
      }

      // 3. Save optimized mappings to MongoDB Atlas
      const username = req.user ? req.user.username : 'admin';
      const galleryItem = await galleryRepository.create({
        title,
        description: description || '',
        category,
        mediaType,
        originalFile: optimizationResult.originalFile,
        optimizedFile: optimizationResult.optimizedFile,
        thumbnail: optimizationResult.thumbnail,
        featured: featured === 'true' || featured === true,
        visibility: visibility || 'public',
        status: status || 'draft',
        uploadedBy: username,
        logs: [{ action: 'upload', timestamp: new Date(), operator: username }]
      });

      res.status(201).json({ success: true, item: galleryItem });
    } catch (err) {
      console.error("Upload controller processing error:", err);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: "Failed to process and upload media item: " + err.message });
    }
  }

  /**
   * Update gallery metadata record
   */
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category, featured, visibility, status } = req.body;
      const username = req.user ? req.user.username : 'admin';

      const existing = await galleryRepository.findById(id);
      if (!existing) {
        return res.status(404).json({ error: "Gallery item not found." });
      }

      const updateData = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (category) updateData.category = category;
      if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;
      if (visibility) updateData.visibility = visibility;
      if (status) updateData.status = status;

      const logs = [...existing.logs, { action: 'edit', timestamp: new Date(), operator: username }];
      const item = await galleryRepository.update(id, { ...updateData, logs });

      res.json({ success: true, item });
    } catch (err) {
      console.error("Update controller metadata error:", err);
      res.status(500).json({ error: "Failed to update gallery item metadata." });
    }
  }

  /**
   * Publish a draft media item
   */
  async publishItem(req, res) {
    try {
      const { id } = req.params;
      const username = req.user ? req.user.username : 'admin';
      
      const item = await galleryRepository.findById(id);
      if (!item) return res.status(404).json({ error: "Gallery item not found." });

      const logs = [...item.logs, { action: 'publish', timestamp: new Date(), operator: username }];
      const updated = await galleryRepository.update(id, { status: 'published', logs });

      res.json({ success: true, item: updated });
    } catch (err) {
      console.error("Publish controller action error:", err);
      res.status(500).json({ error: "Failed to publish gallery item." });
    }
  }

  /**
   * Soft delete database item (send to Trash bin)
   */
  async softDeleteItem(req, res) {
    try {
      const { id } = req.params;
      const username = req.user ? req.user.username : 'admin';
      
      const item = await galleryRepository.softDelete(id, username);
      if (!item) return res.status(404).json({ error: "Gallery item not found." });
      res.json({ success: true, item });
    } catch (err) {
      console.error("Soft delete controller action error:", err);
      res.status(500).json({ error: "Failed to soft delete gallery item." });
    }
  }

  /**
   * Restore a soft deleted item from trash
   */
  async restoreItem(req, res) {
    try {
      const { id } = req.params;
      const username = req.user ? req.user.username : 'admin';
      
      const item = await galleryRepository.restore(id, username);
      if (!item) return res.status(404).json({ error: "Gallery item not found." });
      res.json({ success: true, item });
    } catch (err) {
      console.error("Restore controller action error:", err);
      res.status(500).json({ error: "Failed to restore gallery item." });
    }
  }

  /**
   * Delete files from local disk storage and remove DB record
   */
  async deletePermanently(req, res) {
    try {
      const { id } = req.params;
      const item = await galleryRepository.findById(id);
      if (!item) return res.status(404).json({ error: "Gallery item not found." });

      // Purge original, optimized, thumbnails, and custom thumbnail files
      if (item.originalFile && item.originalFile.path) {
        await storageService.delete(item.originalFile.path);
      }
      if (item.optimizedFile && item.optimizedFile.path) {
        await storageService.delete(item.optimizedFile.path);
      }
      if (item.optimizedFile && item.optimizedFile.sizes) {
        const sizes = item.optimizedFile.sizes;
        await Promise.all([
          storageService.delete(sizes.thumbnail),
          storageService.delete(sizes.medium),
          storageService.delete(sizes.large)
        ]);
      }
      if (item.thumbnail && item.thumbnail !== item.optimizedFile?.sizes?.thumbnail) {
        await storageService.delete(item.thumbnail);
      }

      await galleryRepository.deletePermanently(id);
      res.json({ success: true, message: "Gallery item and media files permanently deleted." });
    } catch (err) {
      console.error("Permanent delete controller error:", err);
      res.status(500).json({ error: "Failed to delete gallery item permanently." });
    }
  }

  /**
   * Bulk publish drafts
   */
  async bulkPublish(req, res) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "A non-empty list of IDs is required." });
      }
      const username = req.user ? req.user.username : 'admin';
      await galleryRepository.bulkPublish(ids, username);
      res.json({ success: true, message: "Selected gallery items published." });
    } catch (err) {
      console.error("Bulk publish controller error:", err);
      res.status(500).json({ error: "Failed to perform bulk publish action." });
    }
  }

  /**
   * Bulk soft delete
   */
  async bulkSoftDelete(req, res) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "A non-empty list of IDs is required." });
      }
      const username = req.user ? req.user.username : 'admin';
      await galleryRepository.bulkSoftDelete(ids, username);
      res.json({ success: true, message: "Selected gallery items moved to trash." });
    } catch (err) {
      console.error("Bulk soft delete controller error:", err);
      res.status(500).json({ error: "Failed to perform bulk soft delete action." });
    }
  }

  /**
   * Bulk restore from trash
   */
  async bulkRestore(req, res) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "A non-empty list of IDs is required." });
      }
      const username = req.user ? req.user.username : 'admin';
      await galleryRepository.bulkRestore(ids, username);
      res.json({ success: true, message: "Selected gallery items restored." });
    } catch (err) {
      console.error("Bulk restore controller error:", err);
      res.status(500).json({ error: "Failed to perform bulk restore action." });
    }
  }

  /**
   * Bulk permanent delete
   */
  async bulkDeletePermanently(req, res) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "A non-empty list of IDs is required." });
      }

      for (const id of ids) {
        const item = await galleryRepository.findById(id);
        if (item) {
          if (item.originalFile && item.originalFile.path) {
            await storageService.delete(item.originalFile.path);
          }
          if (item.optimizedFile && item.optimizedFile.path) {
            await storageService.delete(item.optimizedFile.path);
          }
          if (item.optimizedFile && item.optimizedFile.sizes) {
            const sizes = item.optimizedFile.sizes;
            await Promise.all([
              storageService.delete(sizes.thumbnail),
              storageService.delete(sizes.medium),
              storageService.delete(sizes.large)
            ]);
          }
          if (item.thumbnail && item.thumbnail !== item.optimizedFile?.sizes?.thumbnail) {
            await storageService.delete(item.thumbnail);
          }
        }
      }

      await galleryRepository.bulkDeletePermanently(ids);
      res.json({ success: true, message: "Selected items and associated media files permanently deleted." });
    } catch (err) {
      console.error("Bulk permanent delete controller error:", err);
      res.status(500).json({ error: "Failed to perform bulk permanent delete action." });
    }
  }
}

module.exports = new GalleryController();
