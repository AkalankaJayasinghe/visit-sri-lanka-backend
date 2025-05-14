const Restaurant = require('../models/Restaurant');
const { handleImageUploads, deleteImages } = require('../utils/imageHandler');

const restaurantController = {
  // Get all restaurants
  getAllRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.find();
      res.json(restaurants);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get single restaurant
  getRestaurantById: async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.json(restaurant);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create restaurant
  createRestaurant: async (req, res) => {
    try {
      // Handle image uploads
      const imagePaths = handleImageUploads(req);
      
      const newRestaurant = new Restaurant({
        ...req.body,
        ownerId: req.user.id,
        images: imagePaths
      });

      const restaurant = await newRestaurant.save();
      res.status(201).json(restaurant);
    } catch (err) {
      // Delete uploaded images if save fails
      if (req.files) {
        const imagePaths = req.files.map(file => file.path);
        deleteImages(imagePaths);
      }
      
      res.status(400).json({ message: err.message });
    }
  },

  // Update restaurant
  updateRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      // Check ownership
      if (restaurant.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Handle image uploads if any
      const newImagePaths = handleImageUploads(req);
      
      // Combine existing images with new ones, unless replace_images flag is set
      let updatedImages = restaurant.images;
      if (req.body.replace_images === 'true') {
        // Delete old images
        deleteImages(restaurant.images);
        updatedImages = newImagePaths;
      } else if (newImagePaths.length > 0) {
        // Add new images to existing ones (up to 5 total)
        updatedImages = [...restaurant.images, ...newImagePaths].slice(0, 5);
      }
      
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        req.params.id,
        { 
          $set: {
            ...req.body,
            images: updatedImages
          }
        },
        { new: true }
      );

      res.json(updatedRestaurant);
    } catch (err) {
      // Delete uploaded images if update fails
      if (req.files) {
        const imagePaths = req.files.map(file => file.path);
        deleteImages(imagePaths);
      }
      
      res.status(400).json({ message: err.message });
    }
  },

  // Delete restaurant
  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      // Check ownership
      if (restaurant.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Delete associated images
      deleteImages(restaurant.images);
      
      await restaurant.deleteOne(); // Using deleteOne() instead of remove()
      res.json({ message: 'Restaurant removed' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Search restaurants by cuisine
  searchRestaurantsByCuisine: async (req, res) => {
    try {
      const { cuisine } = req.query;
      const restaurants = await Restaurant.find({
        cuisine: { $regex: cuisine, $options: 'i' }
      });
      res.json(restaurants);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
  // Delete a specific image from a restaurant
  deleteRestaurantImage: async (req, res) => {
    try {
      const { id, imageIndex } = req.params;
      const restaurant = await Restaurant.findById(id);
      
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      
      // Check ownership
      if (restaurant.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      const imageToDelete = restaurant.images[imageIndex];
      if (!imageToDelete) {
        return res.status(404).json({ message: 'Image not found' });
      }
      
      // Delete the file
      deleteImages([imageToDelete]);
      
      // Remove from array
      restaurant.images.splice(imageIndex, 1);
      await restaurant.save();
      
      res.json({ message: 'Image deleted successfully', images: restaurant.images });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = restaurantController;