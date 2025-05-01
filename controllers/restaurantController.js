const Restaurant = require('../models/Restaurant');

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
      const newRestaurant = new Restaurant({
        ...req.body,
        ownerId: req.user.id
      });

      const restaurant = await newRestaurant.save();
      res.status(201).json(restaurant);
    } catch (err) {
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

      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.json(updatedRestaurant);
    } catch (err) {
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
  }
};

module.exports = restaurantController;