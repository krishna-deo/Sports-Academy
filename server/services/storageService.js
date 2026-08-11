const fs = require('fs');
const path = require('path');

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
   * Deletes a file locally
   * @param {string} relativePath File path relative to server root
   */
  async delete(relativePath) {
    if (!relativePath) return;
    
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
   * Cloud storage integration hooks (AWS S3, Cloudinary ready)
   */
  async uploadToCloud(localFilePath, destinationKey) {
    // Future integration boilerplate:
    // const s3 = new AWS.S3();
    // return s3.upload({ Bucket, Key: destinationKey, Body: fs.createReadStream(localFilePath) }).promise();
    throw new Error("Cloud Storage SDK integration is not active.");
  }
}

module.exports = new StorageService();
