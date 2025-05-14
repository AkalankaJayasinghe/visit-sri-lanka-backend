const fs = require('fs');
const path = require('path');

// Handle image uploads, return array of image paths
exports.handleImageUploads = (req) => {
  const imagePaths = [];
  
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      // Convert Windows-style path to URL-style path
      const filePath = file.path.replace(/\\/g, '/');
      imagePaths.push(filePath);
    });
  }
  
  return imagePaths;
};

// Delete images
exports.deleteImages = (imagePaths) => {
  if (Array.isArray(imagePaths) && imagePaths.length > 0) {
    imagePaths.forEach(imagePath => {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error(`Failed to delete image at ${imagePath}:`, err);
      }
    });
  }
};