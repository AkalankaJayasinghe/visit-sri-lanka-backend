const Hotel = require('../models/Hotel');
const { handleImageUploads, deleteImages } = require('../utils/imageHandler');

const hotelController = {
  // Get all hotels
  getAllHotels: async (req, res) => {
    try {
      const hotels = await Hotel.find();
      res.json(hotels);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get single hotel
  getHotelById: async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      res.json(hotel);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create hotel
  createHotel: async (req, res) => {
    try {
      // Handle image uploads
      const imagePaths = handleImageUploads(req);
      
      const newHotel = new Hotel({
        ...req.body,
        ownerId: req.user.id,
        images: imagePaths
      });

      const hotel = await newHotel.save();
      res.status(201).json(hotel);
    } catch (err) {
      // Delete uploaded images if save fails
      if (req.files) {
        const imagePaths = req.files.map(file => file.path);
        deleteImages(imagePaths);
      }
      
      res.status(400).json({ message: err.message });
    }
  },

  // Update hotel
  updateHotel: async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Check ownership
      if (hotel.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Handle image uploads if any
      const newImagePaths = handleImageUploads(req);
      
      // Combine existing images with new ones, unless replace_images flag is set
      let updatedImages = hotel.images;
      if (req.body.replace_images === 'true') {
        // Delete old images
        deleteImages(hotel.images);
        updatedImages = newImagePaths;
      } else if (newImagePaths.length > 0) {
        // Add new images to existing ones (up to 5 total)
        updatedImages = [...hotel.images, ...newImagePaths].slice(0, 5);
      }
      
      const updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        { 
          $set: {
            ...req.body,
            images: updatedImages
          }
        },
        { new: true }
      );

      res.json(updatedHotel);
    } catch (err) {
      // Delete uploaded images if update fails
      if (req.files) {
        const imagePaths = req.files.map(file => file.path);
        deleteImages(imagePaths);
      }
      
      res.status(400).json({ message: err.message });
    }
  },

  // Delete hotel
  deleteHotel: async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Check ownership
      if (hotel.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Delete associated images
      deleteImages(hotel.images);
      
      await hotel.deleteOne(); // Using deleteOne() instead of remove()
      res.json({ message: 'Hotel removed' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Search hotels by location
  searchHotelsByLocation: async (req, res) => {
    try {
      const { city } = req.query;
      const hotels = await Hotel.find({
        'location.city': { $regex: city, $options: 'i' }
      });
      res.json(hotels);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
  // Delete a specific image from a hotel
  deleteHotelImage: async (req, res) => {
    try {
      const { id, imageIndex } = req.params;
      const hotel = await Hotel.findById(id);
      
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      
      // Check ownership
      if (hotel.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      const imageToDelete = hotel.images[imageIndex];
      if (!imageToDelete) {
        return res.status(404).json({ message: 'Image not found' });
      }
      
      // Delete the file
      deleteImages([imageToDelete]);
      
      // Remove from array
      hotel.images.splice(imageIndex, 1);
      await hotel.save();
      
      res.json({ message: 'Image deleted successfully', images: hotel.images });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = hotelController;