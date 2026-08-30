const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log("Cloudinary configuration loaded successfully.");
} else {
  console.warn("WARNING: Cloudinary environment variables are missing. Falling back to local storage.");
}

function extractCloudinaryPublicId(url) {
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const pathAfterUpload = parts[1];
    const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
    const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, "");
    return publicId;
  } catch (err) {
    console.error("Failed to extract public ID from Cloudinary URL:", err);
    return null;
  }
}

class StorageService {
  constructor() {
    this.uploadDir = path.join(__dirname, '..', 'uploads', 'gallery');
    this.ensureDirs();
  }

  ensureDirs() {
    const dirs = [
      path.join(this.uploadDir, 'original'),
      path.join(this.uploadDir, 'optimized'),
      path.join(this.uploadDir, 'thumbnails')
    ];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  isCloudinaryActive() {
    return isCloudinaryConfigured;
  }

  /**
   * Saves a file locally in the configured directory structure
   * @param {string} tempPath Current temporary file path
   * @param {'original'|'optimized'|'thumbnails'} subDir Target subdirectory
   * @param {string} fileName Target file name
   * @returns {Promise<string>} Web-accessible relative file path
   */
  async save(tempPath, subDir, fileName) {
    const destDir = path.join(this.uploadDir, subDir);
    const destPath = path.join(destDir, fileName);

    // Make sure target subdirectory directory exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Move file from temp to final destination
    await fs.promises.rename(tempPath, destPath);
    
    // Return relative URL path
    return `/uploads/gallery/${subDir}/${fileName}`;
  }

  /**
   * Deletes a file locally or from Cloudinary
   * @param {string} relativePath File path relative to server root or Cloudinary URL
   */
  async delete(relativePath) {
    if (!relativePath) return;

    if (relativePath.startsWith('http')) {
      if (isCloudinaryConfigured) {
        const publicId = extractCloudinaryPublicId(relativePath);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Successfully deleted Cloudinary asset: ${publicId}`);
          } catch (err) {
            console.error(`Failed to delete Cloudinary asset ${publicId}:`, err);
          }
        }
      } else {
        console.warn(`Cloudinary not configured. Cannot delete remote asset: ${relativePath}`);
      }
      return;
    }
    
    // Handle leading slashes cleanly
    const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
    const fullPath = path.join(__dirname, '..', cleanPath);
    
    try {
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
    } catch (err) {
      console.error(`Failed to delete storage file at ${fullPath}:`, err);
    }
  }

  /**
   * Uploads a local file to Cloudinary and deletes the local file.
   * @param {string} localFilePath Path to the local file
   * @param {string} folder Target folder name on Cloudinary
   * @returns {Promise<string>} Secure URL of the uploaded asset
   */
  async uploadToCloud(localFilePath, folder = 'general') {
    if (!isCloudinaryConfigured) {
      throw new Error("Cloudinary is not configured. Enable it in your .env file.");
    }
    try {
      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: `sports-academy/${folder}`,
        resource_type: 'auto'
      });
      // Delete local file after upload
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      return result.secure_url;
    } catch (err) {
      // Clean up local file even on failure
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      console.error("Cloudinary upload failed:", err);
      throw err;
    }
  }

  /**
   * Uploads a Base64 encoded image string to Cloudinary.
   * @param {string} base64Data Base64 representation of the image
   * @param {string} folder Target folder name on Cloudinary
   * @returns {Promise<string>} Secure URL of the uploaded asset
   */
  async uploadBase64(base64Data, folder = 'general') {
    if (!isCloudinaryConfigured) {
      console.warn("Cloudinary not configured. Storing image as Base64 in MongoDB.");
      return base64Data;
    }
    try {
      const result = await cloudinary.uploader.upload(base64Data, {
        folder: `sports-academy/${folder}`,
        resource_type: 'image'
      });
      return result.secure_url;
    } catch (err) {
      console.error("Cloudinary Base64 upload failed:", err);
      throw err;
    }
  }
}

module.exports = new StorageService();
