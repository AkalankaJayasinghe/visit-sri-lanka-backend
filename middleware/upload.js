const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create uploads directory if it doesn't exist
const createUploadsDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';
    
    // Determine upload path based on route
    if (req.originalUrl.includes('/hotels')) {
      uploadPath = 'uploads/hotels';
    } else if (req.originalUrl.includes('/restaurants')) {
      uploadPath = 'uploads/restaurants';
    } else if (req.originalUrl.includes('/cabs')) {
      uploadPath = 'uploads/cabs';
    } else if (req.originalUrl.includes('/guides')) {
      uploadPath = 'uploads/guides';
    } else {
      uploadPath = 'uploads/others';
    }
    
    createUploadsDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create upload middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter
});

module.exports = upload;