const CabService = require('../models/CabService');
const { handleImageUploads, deleteImages } = require('../utils/imageHandler');

const cabServiceController = {
  // Get all cab services
  getAllCabServices: async (req, res) => {
    try {
      const cabServices = await CabService.find();
      res.json(cabServices);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get single cab service
  getCabServiceById: async (req, res) => {
    try {
      const cabService = await CabService.findById(req.params.id);
      if (!cabService) {
        return res.status(404).json({ message: 'Cab service not found' });
      }
      res.json(cabService);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create cab service
  createCabService: async (req, res) => {
    try {
      // Handle image uploads
      const imagePaths = handleImageUploads(req);
      
      const newCabService = new CabService({
        ...req.body,
        ownerId: req.user.id,
        images: imagePaths
      });

      const cabService = await newCabService.save();
      res.status(201).json(cabService);
    } catch (err) {
      // Delete uploaded images if save fails
      if (req.files) {
        const imagePaths = req.files.map(file => file.path);
        deleteImages(imagePaths);
      }
      
      res.status(400).json({ message: err.message });
    }
  },

  // Update cab service
  updateCabService: async (req, res) => {
    try {
      const cabService = await CabService.findById(req.params.id);
      
      if (!cabService) {
        return res.status(404).json({ message: 'Cab service not found' });
      }

      // Check ownership
      if (cabService.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Handle image uploads if any
      const newImagePaths = handleImageUploads(req);
      
      // Combine existing images with new ones, unless replace_images flag is set
      let updatedImages = cabService.images;
      if (req.body.replace_images === 'true') {
        // Delete old images
        deleteImages(cabService.images);
        updatedImages = newImagePaths;
      } else if (newImagePaths.length > 0) {
        // Add new images to existing ones (up to 5 total)
        updatedImages = [...cabService.images, ...newImagePaths].slice(0, 5);
      }
      
      const updatedCabService = await CabService.findByIdAndUpdate(
        req.params.id,
        { 
          $set: {
            ...req.body,
            images: updatedImages
          }
        },
        { new: true }
      );

      res.json(updatedCabService);
    } catch (err) {
      // Delete uploaded images if update fails
      if (req.files) {
        const imagePaths = req.files.map(file => file.path);
        deleteImages(imagePaths);
      }
      
      res.status(400).json({ message: err.message });
    }
  },

  // Delete cab service
  deleteCabService: async (req, res) => {
    try {
      const cabService = await CabService.findById(req.params.id);
      
      if (!cabService) {
        return res.status(404).json({ message: 'Cab service not found' });
      }

      // Check ownership
      if (cabService.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Delete associated images
      deleteImages(cabService.images);
      
      await cabService.deleteOne(); // Using deleteOne() instead of remove()
      res.json({ message: 'Cab service removed' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Search cab services by area
  searchCabServicesByArea: async (req, res) => {
    try {
      const { area } = req.query;
      const cabServices = await CabService.find({
        operatingAreas: { $regex: area, $options: 'i' }
      });
      res.json(cabServices);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
  // Delete a specific image from a cab service
  deleteCabServiceImage: async (req, res) => {
    try {
      const { id, imageIndex } = req.params;
      const cabService = await CabService.findById(id);
      
      if (!cabService) {
        return res.status(404).json({ message: 'Cab service not found' });
      }
      
      // Check ownership
      if (cabService.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      const imageToDelete = cabService.images[imageIndex];
      if (!imageToDelete) {
        return res.status(404).json({ message: 'Image not found' });
      }
      
      // Delete the file
      deleteImages([imageToDelete]);
      
      // Remove from array
      cabService.images.splice(imageIndex, 1);
      await cabService.save();
      
      res.json({ message: 'Image deleted successfully', images: cabService.images });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = cabServiceController;