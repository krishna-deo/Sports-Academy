const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const storageService = require('./storageService');

// Helper to execute commands as promises
const execPromise = (cmd) => new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) reject(error);
    else resolve({ stdout, stderr });
  });
});

class GalleryService {
  /**
   * Validate MIME type, extension, and file size limits
   */
  validateFile(file, mediaType) {
    const filename = file.originalname.toLowerCase();
    const ext = path.extname(filename);
    const mime = file.mimetype;

    // Security check: reject executable and unsafe files
    const rejectedExts = ['.exe', '.php', '.html', '.js', '.bat', '.apk', '.zip'];
    if (rejectedExts.includes(ext)) {
      throw new Error(`File type ${ext} is rejected for security reasons.`);
    }

    if (mediaType === 'image') {
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedExts.includes(ext) || !allowedMimes.includes(mime)) {
        throw new Error("Invalid image format. Allowed: JPG, JPEG, PNG, WEBP.");
      }
      // Max image size: 10MB
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image exceeds maximum allowed size of 10 MB.");
      }
    } else if (mediaType === 'video') {
      const allowedExts = ['.mp4', '.mov'];
      const allowedMimes = ['video/mp4', 'video/quicktime'];
      if (!allowedExts.includes(ext) || !allowedMimes.includes(mime)) {
        throw new Error("Invalid video format. Allowed: MP4, MOV.");
      }
      // Max video size: 1GB (auto-compressed if > 300MB)
      if (file.size > 1024 * 1024 * 1024) {
        throw new Error("Video exceeds maximum allowed upload size of 1 GB.");
      }
    } else {
      throw new Error("Unsupported media type specified.");
    }
  }

  /**
   * Optimize upload image, convert to WebP, compress and resize to standard sizes
   */
  async optimizeImage(tempFilePath, originalName) {
    // Generate UUID to prevent directory traversal and file collisions
    const uuid = uuidv4();
    const originalExt = path.extname(originalName).toLowerCase();
    const originalFileName = `${uuid}-orig${originalExt}`;
    const optimizedFileName = `${uuid}.webp`;

    // 1. Move original file to storage
    const originalUrl = await storageService.save(tempFilePath, 'original', originalFileName);
    const fullOriginalPath = path.join(__dirname, '..', originalUrl.startsWith('/') ? originalUrl.substring(1) : originalUrl);

    // 2. Perform compression, resize (limit to 1920x1080 max) and convert to WebP
    const optimizedUrlPath = `/uploads/gallery/optimized/${optimizedFileName}`;
    const fullOptimizedPath = path.join(__dirname, '..', 'uploads', 'gallery', 'optimized', optimizedFileName);

    // Get original metadata
    const meta = await sharp(fullOriginalPath).metadata();
    let width = meta.width || 0;
    let height = meta.height || 0;

    // Downscale if dimension limits are exceeded
    let resizeOptions = {};
    if (width > 1920 || height > 1080) {
      resizeOptions = {
        width: 1920,
        height: 1080,
        fit: 'inside',
        withoutEnlargement: true
      };
    }

    let sharpInstance = sharp(fullOriginalPath);
    if (Object.keys(resizeOptions).length > 0) {
      sharpInstance = sharpInstance.resize(resizeOptions);
    }

    // Convert to WebP format at 80% compression quality
    await sharpInstance.webp({ quality: 80 }).toFile(fullOptimizedPath);

    // Read optimized stats
    const optimizedMeta = await sharp(fullOptimizedPath).metadata();
    const originalSize = fs.statSync(fullOriginalPath).size;
    const optimizedSize = fs.statSync(fullOptimizedPath).size;
    const compressionRatio = Number(((originalSize - optimizedSize) / originalSize * 100).toFixed(2));

    // 3. Generate responsive thumbnail configurations
    const sizes = {
      thumbnail: `/uploads/gallery/thumbnails/${uuid}-thumb.webp`,
      medium: `/uploads/gallery/thumbnails/${uuid}-medium.webp`,
      large: `/uploads/gallery/thumbnails/${uuid}-large.webp`
    };

    const serverRoot = path.join(__dirname, '..');
    
    // Generate thumbnail (300x300 crop), medium (800x600 fit), large (1600x900 fit)
    await Promise.all([
      sharp(fullOriginalPath)
        .resize(300, 300, { fit: 'cover' })
        .webp({ quality: 75 })
        .toFile(path.join(serverRoot, 'uploads', 'gallery', 'thumbnails', `${uuid}-thumb.webp`)),
      sharp(fullOriginalPath)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(serverRoot, 'uploads', 'gallery', 'thumbnails', `${uuid}-medium.webp`)),
      sharp(fullOriginalPath)
        .resize(1600, 900, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(serverRoot, 'uploads', 'gallery', 'thumbnails', `${uuid}-large.webp`))
    ]);

    return {
      originalFile: {
        path: originalUrl,
        size: originalSize,
        mimeType: `image/${originalExt.substring(1)}`
      },
      optimizedFile: {
        path: optimizedUrlPath,
        size: optimizedSize,
        compressionRatio: compressionRatio > 0 ? compressionRatio : 0,
        dimensions: {
          width: optimizedMeta.width || width,
          height: optimizedMeta.height || height
        },
        sizes
      },
      thumbnail: sizes.thumbnail
    };
  }

  /**
   * Optimize uploaded video (compress, downscale to 1080p, and capture thumbnail frame)
   */
  async optimizeVideo(tempFilePath, originalName, customThumbnailFile = null) {
    const uuid = uuidv4();
    const originalExt = path.extname(originalName).toLowerCase();
    const originalFileName = `${uuid}-orig${originalExt}`;
    const optimizedFileName = `${uuid}.mp4`;
    const thumbnailFileName = `${uuid}-vthumb.jpg`;

    // 1. Move original video to storage
    const originalUrl = await storageService.save(tempFilePath, 'original', originalFileName);
    const fullOriginalPath = path.join(__dirname, '..', 'uploads', 'gallery', 'original', originalFileName);

    const optimizedUrlPath = `/uploads/gallery/optimized/${optimizedFileName}`;
    const fullOptimizedPath = path.join(__dirname, '..', 'uploads', 'gallery', 'optimized', optimizedFileName);

    const thumbnailPath = `/uploads/gallery/thumbnails/${thumbnailFileName}`;
    const fullThumbnailPath = path.join(__dirname, '..', 'uploads', 'gallery', 'thumbnails', thumbnailFileName);

    // 2. Validate external FFmpeg dependency
    let hasFFmpeg = false;
    try {
      await execPromise('ffmpeg -version');
      hasFFmpeg = true;
    } catch (e) {
      console.warn("Warning: FFmpeg bin not found. Falling back to simple file copy operations.");
    }

    const originalSize = fs.statSync(fullOriginalPath).size;
    let optimizedSize = originalSize;
    let compressionRatio = 0;

    if (hasFFmpeg) {
      try {
        // Compress and downscale
        // If file size is > 300MB, compress aggressively to 720p with crf 32. Otherwise, standard 1080p crf 28.
        let scaleFilter = "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease";
        let crfVal = 28;
        let audioBitrate = "128k";
        
        if (originalSize > 300 * 1024 * 1024) {
          scaleFilter = "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease";
          crfVal = 32;
          audioBitrate = "96k";
        }

        const cmd = `ffmpeg -i "${fullOriginalPath}" -vf "${scaleFilter}" -vcodec libx264 -crf ${crfVal} -preset fast -acodec aac -b:a ${audioBitrate} -y "${fullOptimizedPath}"`;
        await execPromise(cmd);
        optimizedSize = fs.statSync(fullOptimizedPath).size;
        compressionRatio = Number(((originalSize - optimizedSize) / originalSize * 100).toFixed(2));
      } catch (err) {
        console.error("FFmpeg compression failed. Storing copy of original file instead:", err);
        fs.copyFileSync(fullOriginalPath, fullOptimizedPath);
      }

      // Generate video thumbnail (Capture frame at 5 seconds)
      if (!customThumbnailFile) {
        try {
          const thumbCmd = `ffmpeg -ss 00:00:05 -i "${fullOriginalPath}" -vframes 1 -q:v 2 -y "${fullThumbnailPath}"`;
          await execPromise(thumbCmd);
        } catch (err) {
          console.error("FFmpeg thumbnail capture failed. Storing dummy placeholder:", err);
          fs.writeFileSync(fullThumbnailPath, ""); // Create placeholder
        }
      }
    } else {
      // Fallback: duplicate original file as optimized
      fs.copyFileSync(fullOriginalPath, fullOptimizedPath);
      if (!customThumbnailFile) {
        fs.writeFileSync(fullThumbnailPath, ""); // Empty placeholder
      }
    }

    // Handle custom user-uploaded video thumbnail
    if (customThumbnailFile) {
      try {
        await sharp(customThumbnailFile.path)
          .resize(300, 300, { fit: 'cover' })
          .webp({ quality: 80 })
          .toFile(fullThumbnailPath);
        // Clear temp file
        fs.unlinkSync(customThumbnailFile.path);
      } catch (err) {
        console.error("Failed to process custom video thumbnail upload:", err);
      }
    }

    return {
      originalFile: {
        path: originalUrl,
        size: originalSize,
        mimeType: `video/${originalExt.substring(1)}`
      },
      optimizedFile: {
        path: optimizedUrlPath,
        size: optimizedSize,
        compressionRatio: compressionRatio > 0 ? compressionRatio : 0,
        dimensions: {
          width: 1920,
          height: 1080
        },
        sizes: {
          thumbnail: thumbnailPath,
          medium: thumbnailPath,
          large: thumbnailPath
        }
      },
    };
  }

  async processCustomThumbnail(tempFilePath) {
    const uuid = uuidv4();
    const thumbnailFileName = `${uuid}-thumb.webp`;
    const fullThumbnailPath = path.join(__dirname, '..', 'uploads', 'gallery', 'thumbnails', thumbnailFileName);
    
    await sharp(tempFilePath)
      .resize(300, 300, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(fullThumbnailPath);
    
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    return `/uploads/gallery/thumbnails/${thumbnailFileName}`;
  }

  async optimizeEventPhoto(tempFilePath, originalName) {
    const uuid = uuidv4();
    const originalExt = path.extname(originalName).toLowerCase();
    
    // Save original locally first to do sharp optimization
    const originalUrl = await storageService.save(tempFilePath, 'original', `${uuid}-orig${originalExt}`);
    const fullOriginalPath = path.join(__dirname, '..', originalUrl.startsWith('/') ? originalUrl.substring(1) : originalUrl);
    
    // Convert and save optimized WebP
    const optimizedFileName = `${uuid}.webp`;
    const optimizedUrlPath = `/uploads/gallery/optimized/${optimizedFileName}`;
    const fullOptimizedPath = path.join(__dirname, '..', 'uploads', 'gallery', 'optimized', optimizedFileName);
    
    const meta = await sharp(fullOriginalPath).metadata();
    let resizeOptions = {};
    if ((meta.width || 0) > 1920 || (meta.height || 0) > 1080) {
      resizeOptions = { width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true };
    }
    
    let sharpInstance = sharp(fullOriginalPath);
    if (Object.keys(resizeOptions).length > 0) {
      sharpInstance = sharpInstance.resize(resizeOptions);
    }
    
    await sharpInstance.webp({ quality: 80 }).toFile(fullOptimizedPath);
    const optimizedSize = fs.statSync(fullOptimizedPath).size;
    
    if (storageService.isCloudinaryActive()) {
      try {
        const cloudUrl = await storageService.uploadToCloud(fullOptimizedPath, 'gallery');
        // Clean up the original local file
        if (fs.existsSync(fullOriginalPath)) {
          fs.unlinkSync(fullOriginalPath);
        }
        return {
          path: cloudUrl,
          size: optimizedSize
        };
      } catch (err) {
        console.error("Failed to upload optimized event photo to Cloudinary, falling back to local:", err);
        return {
          path: optimizedUrlPath,
          size: optimizedSize
        };
      }
    }

    return {
      path: optimizedUrlPath,
      size: optimizedSize
    };
  }
}

module.exports = new GalleryService();
