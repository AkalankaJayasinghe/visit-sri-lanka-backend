const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/hotels
// @desc    Get all hotels
// @access  Public
router.get('/', hotelController.getAllHotels);

// @route   GET api/hotels/search
// @desc    Search hotels by location
// @access  Public
router.get('/search', hotelController.searchHotelsByLocation);

// @route   GET api/hotels/:id
// @desc    Get hotel by ID
// @access  Public
router.get('/:id', hotelController.getHotelById);

// @route   POST api/hotels
// @desc    Create a hotel
// @access  Private + hotel_owner only
router.post(
  '/',
  [auth, roleCheck(['hotel_owner'])],
  hotelController.createHotel
);

// @route   PUT api/hotels/:id
// @desc    Update a hotel
// @access  Private + hotel_owner only
router.put(
  '/:id',
  [auth, roleCheck(['hotel_owner'])],
  hotelController.updateHotel
);

// @route   DELETE api/hotels/:id
// @desc    Delete a hotel
// @access  Private + hotel_owner only
router.delete(
  '/:id',
  [auth, roleCheck(['hotel_owner'])],
  hotelController.deleteHotel
);

module.exports = router;