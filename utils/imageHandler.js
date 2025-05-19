const fs = require('fs');
const path = require('path');

// Handle image uploads, return array of image paths
exports.handleImageUploads = (req) => {
  const imagePaths = [];
  
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      // Make sure to return paths that start with /uploads/
      // This is important for proper URL formation on the frontend
      const filePath = file.path.replace(/\\/g, '/');
      
      // If the path doesn't start with /uploads/, add it
      const relativePath = filePath.startsWith('/uploads') 
        ? filePath 
        : '/' + filePath;
        
      imagePaths.push(relativePath);
    });
  }
  
  return imagePaths;
};

// Delete images
exports.deleteImages = (imagePaths) => {
  if (Array.isArray(imagePaths) && imagePaths.length > 0) {
    imagePaths.forEach(imagePath => {
      try {
        // Remove the leading slash if present for file system operations
        const cleanPath = imagePath.startsWith('/') 
          ? imagePath.substring(1) 
          : imagePath;
          
        fs.unlinkSync(cleanPath);
      } catch (err) {
        console.error(`Failed to delete image at ${imagePath}:`, err);
      }
    });
  }
};