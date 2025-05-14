const Guide = require('../models/Guide');
const { handleImageUploads, deleteImages } = require('../utils/imageHandler');

const guideController = {
  // Get all guides
  getAllGuides: async (req, res) => {
    try {
      const guides = await Guide.find();
      res.json(guides);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get single guide
  getGuideById: async (req, res) => {
    try {
      const guide = await Guide.findById(req.params.id);
      if (!guide) {
        return res.status(404).json({ message: 'Guide not found' });
      }
      res.json(guide);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create guide
  createGuide: async (req, res) => {
    try {
      // Handle image uploads
      const imagePaths = handleImageUploads(req);
      
      const newGuide = new Guide({
        ...req.body,
        ownerId: req.user.id,
        images: imagePaths
      });

      const guide = await newGuide.save();
      res.status(201).json(guide);
    } catch (err) {
      // Delete uploaded images if save fails
      if (req.files) {
        const imagePaths = req.files.map(file => file.path);
        deleteImages(imagePaths);
      }
      
      res.status(400).json({ message: err.message });
    }
  },

  // Update guide
  updateGuide: async (req, res) => {
    try {
      const guide = await Guide.findById(req.params.id);
      
      if (!guide) {
        return res.status(404).json({ message: 'Guide not found' });
      }

      // Check ownership
      if (guide.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Handle image uploads if any
      const newImagePaths = handleImageUploads(req);
      
      // Combine existing images with new ones, unless replace_images flag is set
      let updatedImages = guide.images;
      if (req.body.replace_images === 'true') {
        // Delete old images
        deleteImages(guide.images);
        updatedImages = newImagePaths;
      } else if (newImagePaths.length > 0) {
        // Add new images to existing ones (up to 5 total)
        updatedImages = [...guide.images, ...newImagePaths].slice(0, 5);
      }
      
      const updatedGuide = await Guide.findByIdAndUpdate(
        req.params.id,
        { 
          $set: {
            ...req.body,
            images: updatedImages
          }
        },
        { new: true }
      );

      res.json(updatedGuide);
    } catch (err) {
      // Delete uploaded images if update fails
      if (req.files) {
        const imagePaths = req.files.map(file => file.path);
        deleteImages(imagePaths);
      }
      
      res.status(400).json({ message: err.message });
    }
  },

  // Delete guide
  deleteGuide: async (req, res) => {
    try {
      const guide = await Guide.findById(req.params.id);
      
      if (!guide) {
        return res.status(404).json({ message: 'Guide not found' });
      }

      // Check ownership
      if (guide.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Delete associated images
      deleteImages(guide.images);
      
      await guide.deleteOne(); // Using deleteOne() instead of remove()
      res.json({ message: 'Guide removed' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Search guides by language or specialization
  searchGuides: async (req, res) => {
    try {
      const { language, specialization } = req.query;
      let searchQuery = {};

      if (language) {
        searchQuery.languages = { $regex: language, $options: 'i' };
      }

      if (specialization) {
        searchQuery.specializations = { $regex: specialization, $options: 'i' };
      }

      const guides = await Guide.find(searchQuery);
      res.json(guides);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
  // Delete a specific image from a guide
  deleteGuideImage: async (req, res) => {
    try {
      const { id, imageIndex } = req.params;
      const guide = await Guide.findById(id);
      
      if (!guide) {
        return res.status(404).json({ message: 'Guide not found' });
      }
      
      // Check ownership
      if (guide.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      const imageToDelete = guide.images[imageIndex];
      if (!imageToDelete) {
        return res.status(404).json({ message: 'Image not found' });
      }
      
      // Delete the file
      deleteImages([imageToDelete]);
      
      // Remove from array
      guide.images.splice(imageIndex, 1);
      await guide.save();
      
      res.json({ message: 'Image deleted successfully', images: guide.images });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = guideController;