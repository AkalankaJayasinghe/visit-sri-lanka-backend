const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/restaurants
// @desc    Get all restaurants
// @access  Public
router.get('/', restaurantController.getAllRestaurants);

// @route   GET api/restaurants/search
// @desc    Search restaurants by cuisine
// @access  Public
router.get('/search', restaurantController.searchRestaurantsByCuisine);

// @route   GET api/restaurants/:id
// @desc    Get restaurant by ID
// @access  Public
router.get('/:id', restaurantController.getRestaurantById);

// @route   POST api/restaurants
// @desc    Create a restaurant
// @access  Private + restaurant_owner only
router.post(
  '/',
  [auth, roleCheck(['restaurant_owner'])],
  restaurantController.createRestaurant
);

// @route   PUT api/restaurants/:id
// @desc    Update a restaurant
// @access  Private + restaurant_owner only
router.put(
  '/:id',
  [auth, roleCheck(['restaurant_owner'])],
  restaurantController.updateRestaurant
);

// @route   DELETE api/restaurants/:id
// @desc    Delete a restaurant
// @access  Private + restaurant_owner only
router.delete(
  '/:id',
  [auth, roleCheck(['restaurant_owner'])],
  restaurantController.deleteRestaurant
);

module.exports = router;