const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

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
  [auth, roleCheck(['restaurant_owner']), upload.array('images', 5)],
  restaurantController.createRestaurant
);

// @route   PUT api/restaurants/:id
// @desc    Update a restaurant
// @access  Private + restaurant_owner only
router.put(
  '/:id',
  [auth, roleCheck(['restaurant_owner']), upload.array('images', 5)],
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

// @route   DELETE api/restaurants/:id/images/:imageIndex
// @desc    Delete a specific image from a restaurant
// @access  Private + restaurant_owner only
router.delete(
  '/:id/images/:imageIndex',
  [auth, roleCheck(['restaurant_owner'])],
  restaurantController.deleteRestaurantImage
);

module.exports = router;