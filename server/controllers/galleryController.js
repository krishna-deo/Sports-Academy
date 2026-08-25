const galleryRepository = require('../repositories/galleryRepository');
const galleryService = require('../services/galleryService');
const storageService = require('../services/storageService');
const Gallery = require('../models/Gallery');
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
        search: req.query.search || null,
        status: req.query.status || 'published',
        mediaType: req.query.mediaType || null,
        isDeleted: req.query.isDeleted === 'true'
      };

      const result = await galleryRepository.findWithFilters(filters);
      res.json(result);
    } catch (err) {
      console.error("Get gallery events query error:", err);
      res.status(500).json({ error: "Failed to query gallery events." });
    }
  }

  /**
   * Get overall gallery dashboard stats
   */
  async getStats(req, res) {
    try {
      const events = await Gallery.find({ isDeleted: false });
      let totalImages = 0;
      let publishedEvents = 0;
      let draftEvents = 0;

      events.forEach(e => {
        totalImages += (e.photos ? e.photos.length : 0);
        if (e.status === 'published') publishedEvents++;
        else if (e.status === 'draft') draftEvents++;
      });

      res.json({
        totalEvents: events.length,
        totalImages,
        publishedEvents,
        draftEvents
      });
    } catch (err) {
      console.error("Get gallery stats error:", err);
      res.status(500).json({ error: "Failed to query gallery stats." });
    }
  }

  /**
   * Upload and Optimize Event Gallery and photos
   */
  async uploadItem(req, res) {
    try {
      const { name, category, date, description, location, status, coverIndex, mediaType, videoUrl } = req.body;
      const files = req.files;

      if (!name || !category || !date) {
        // Cleanup uploaded files
        if (files) {
          if (files.photos) {
            files.photos.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
          }
          if (files.coverImage) {
            files.coverImage.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
          }
        }
        return res.status(400).json({ error: "Event name, category, and date are required." });
      }

      const isVideo = mediaType === 'video';
      let photoItems = [];
      let coverImageUrl = '';

      if (isVideo) {
        if (!videoUrl) {
          if (files && files.coverImage) {
            files.coverImage.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
          }
          return res.status(400).json({ error: "YouTube URL is required for video uploads." });
        }

        // Optimize custom cover image if uploaded
        const customCoverFile = files && files.coverImage ? files.coverImage[0] : null;
        if (customCoverFile) {
          try {
            const optCover = await galleryService.optimizeEventPhoto(customCoverFile.path, customCoverFile.originalname);
            coverImageUrl = optCover.path;
          } catch (err) {
            console.error("Failed to optimize custom cover image:", err);
          }
        } else {
          // Parse YouTube ID
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          const match = videoUrl.match(regExp);
          const youtubeId = (match && match[2].length === 11) ? match[2] : '';
          if (youtubeId) {
            coverImageUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
          } else {
            coverImageUrl = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop";
          }
        }
      } else {
        // Image Album upload
        const uploadedPhotos = files && files.photos ? files.photos : [];
        if (uploadedPhotos.length === 0) {
          return res.status(400).json({ error: "At least one photo must be uploaded." });
        }

        // 1. Optimize all uploaded photos
        for (const f of uploadedPhotos) {
          try {
            const opt = await galleryService.optimizeEventPhoto(f.path, f.originalname);
            photoItems.push(opt);
          } catch (err) {
            console.error(`Failed to optimize file ${f.originalname}:`, err);
          }
        }

        if (photoItems.length === 0) {
          return res.status(400).json({ error: "Failed to process or optimize any uploaded photos." });
        }

        // 2. Determine cover image
        const customCoverFile = files && files.coverImage ? files.coverImage[0] : null;
        if (customCoverFile) {
          try {
            const optCover = await galleryService.optimizeEventPhoto(customCoverFile.path, customCoverFile.originalname);
            coverImageUrl = optCover.path;
          } catch (err) {
            console.error("Failed to optimize custom cover image:", err);
          }
        } else {
          const index = parseInt(coverIndex) || 0;
          const selectedIndex = (index >= 0 && index < photoItems.length) ? index : 0;
          coverImageUrl = photoItems[selectedIndex].path;
        }
      }

      // 3. Create the event gallery item in database
      const username = req.user ? req.user.username : 'admin';
      const galleryItem = await galleryRepository.create({
        name,
        category,
        date: new Date(date),
        description: description || '',
        location: location || '',
        coverImage: coverImageUrl,
        photos: photoItems,
        mediaType: mediaType || 'image',
        videoUrl: isVideo ? videoUrl : '',
        status: status || 'draft',
        uploadedBy: username,
        logs: [{ action: 'upload', timestamp: new Date(), operator: username }]
      });

      res.status(201).json({ success: true, item: galleryItem });
    } catch (err) {
      console.error("Upload controller processing error:", err);
      if (req.files) {
        if (req.files.photos) {
          req.files.photos.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
        }
        if (req.files.coverImage) {
          req.files.coverImage.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
        }
      }
      res.status(500).json({ error: "Failed to process and upload event gallery: " + err.message });
    }
  }

  /**
   * Update gallery metadata record and handle photos diff
   */
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const { name, category, date, description, location, status, deletedPhotos, coverImage, mediaType, videoUrl } = req.body;
      const files = req.files;
      const username = req.user ? req.user.username : 'admin';

      const existing = await galleryRepository.findById(id);
      if (!existing) {
        return res.status(404).json({ error: "Event gallery not found." });
      }

      let updatedPhotos = [...existing.photos];

      // 1. Remove deleted photos
      if (deletedPhotos) {
        let toDeletePaths = [];
        try {
          toDeletePaths = Array.isArray(deletedPhotos) ? deletedPhotos : JSON.parse(deletedPhotos);
        } catch (e) {
          if (typeof deletedPhotos === 'string') {
            toDeletePaths = deletedPhotos.split(',').map(p => p.trim());
          }
        }

        if (toDeletePaths.length > 0) {
          updatedPhotos = updatedPhotos.filter(p => !toDeletePaths.includes(p.path));
        }
      }

      // 2. Add newly uploaded photos
      const newPhotosUploaded = files && files.photos ? files.photos : [];
      for (const f of newPhotosUploaded) {
        try {
          const opt = await galleryService.optimizeEventPhoto(f.path, f.originalname);
          updatedPhotos.push(opt);
        } catch (err) {
          console.error("Failed to optimize additional photo:", err);
        }
      }

      // 3. Update cover image
      const activeMediaType = mediaType || existing.mediaType;
      const activeVideoUrl = videoUrl !== undefined ? videoUrl : existing.videoUrl;
      
      let coverImageUrl = coverImage || existing.coverImage;
      const newCoverFile = files && files.coverImage ? files.coverImage[0] : null;
      
      if (newCoverFile) {
        try {
          const optCover = await galleryService.optimizeEventPhoto(newCoverFile.path, newCoverFile.originalname);
          coverImageUrl = optCover.path;
        } catch (err) {
          console.error("Failed to optimize new cover image:", err);
        }
      } else if (activeMediaType === 'video' && (!coverImageUrl || coverImageUrl.startsWith('https://img.youtube.com') || videoUrl !== undefined)) {
        // Generate or update YouTube cover image
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = activeVideoUrl ? activeVideoUrl.match(regExp) : null;
        const youtubeId = (match && match[2].length === 11) ? match[2] : '';
        if (youtubeId) {
          coverImageUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
        } else if (!coverImageUrl) {
          coverImageUrl = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop";
        }
      } else if (!coverImageUrl && updatedPhotos.length > 0) {
        coverImageUrl = updatedPhotos[0].path;
      }

      const updateData = {
        photos: updatedPhotos,
        coverImage: coverImageUrl
      };

      if (name) updateData.name = name;
      if (category) updateData.category = category;
      if (date) updateData.date = new Date(date);
      if (description !== undefined) updateData.description = description;
      if (location !== undefined) updateData.location = location;
      if (status) updateData.status = status;
      if (mediaType) updateData.mediaType = mediaType;
      if (videoUrl !== undefined) updateData.videoUrl = videoUrl;

      const logs = [...existing.logs, { action: 'edit', timestamp: new Date(), operator: username }];
      const item = await galleryRepository.update(id, { ...updateData, logs });

      res.json({ success: true, item });
    } catch (err) {
      console.error("Update event gallery error:", err);
      if (req.files) {
        if (req.files.photos) {
          req.files.photos.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
        }
        if (req.files.coverImage) {
          req.files.coverImage.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
        }
      }
      res.status(500).json({ error: "Failed to update event gallery: " + err.message });
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
      if (!item) return res.status(404).json({ error: "Event gallery not found." });

      const logs = [...item.logs, { action: 'publish', timestamp: new Date(), operator: username }];
      const updated = await galleryRepository.update(id, { status: 'published', logs });

      res.json({ success: true, item: updated });
    } catch (err) {
      console.error("Publish controller action error:", err);
      res.status(500).json({ error: "Failed to publish event gallery." });
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
      if (!item) return res.status(404).json({ error: "Event gallery not found." });
      res.json({ success: true, item });
    } catch (err) {
      console.error("Soft delete controller action error:", err);
      res.status(500).json({ error: "Failed to soft delete event gallery." });
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
      if (!item) return res.status(404).json({ error: "Event gallery not found." });
      res.json({ success: true, item });
    } catch (err) {
      console.error("Restore controller action error:", err);
      res.status(500).json({ error: "Failed to restore event gallery." });
    }
  }

  /**
   * Delete files from local disk storage and remove DB record
   */
  async deletePermanently(req, res) {
    try {
      const { id } = req.params;
      const item = await galleryRepository.findById(id);
      if (!item) return res.status(404).json({ error: "Event gallery not found." });

      if (item.photos && item.photos.length > 0) {
        for (const p of item.photos) {
          if (p.path) await storageService.delete(p.path);
        }
      }
      if (item.coverImage) {
        await storageService.delete(item.coverImage);
      }

      await galleryRepository.deletePermanently(id);
      res.json({ success: true, message: "Event gallery and associated photos permanently deleted." });
    } catch (err) {
      console.error("Permanent delete controller error:", err);
      res.status(500).json({ error: "Failed to delete event gallery permanently." });
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
      res.json({ success: true, message: "Selected events published." });
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
      res.json({ success: true, message: "Selected events moved to trash." });
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
      res.json({ success: true, message: "Selected events restored." });
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
          if (item.photos && item.photos.length > 0) {
            for (const p of item.photos) {
              if (p.path) await storageService.delete(p.path);
            }
          }
          if (item.coverImage) {
            await storageService.delete(item.coverImage);
          }
        }
      }

      await galleryRepository.bulkDeletePermanently(ids);
      res.json({ success: true, message: "Selected events and associated photos permanently deleted." });
    } catch (err) {
      console.error("Bulk permanent delete controller error:", err);
      res.status(500).json({ error: "Failed to perform bulk permanent delete action." });
    }
  }
}

module.exports = new GalleryController();
