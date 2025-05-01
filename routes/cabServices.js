const express = require('express');
const router = express.Router();
const cabServiceController = require('../controllers/cabServiceController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/cabs
// @desc    Get all cab services
// @access  Public
router.get('/', cabServiceController.getAllCabServices);

// @route   GET api/cabs/search
// @desc    Search cab services by area
// @access  Public
router.get('/search', cabServiceController.searchCabServicesByArea);

// @route   GET api/cabs/:id
// @desc    Get cab service by ID
// @access  Public
router.get('/:id', cabServiceController.getCabServiceById);

// @route   POST api/cabs
// @desc    Create a cab service
// @access  Private + cab_driver only
router.post(
  '/',
  [auth, roleCheck(['cab_driver'])],
  cabServiceController.createCabService
);

// @route   PUT api/cabs/:id
// @desc    Update a cab service
// @access  Private + cab_driver only
router.put(
  '/:id',
  [auth, roleCheck(['cab_driver'])],
  cabServiceController.updateCabService
);

// @route   DELETE api/cabs/:id
// @desc    Delete a cab service
// @access  Private + cab_driver only
router.delete(
  '/:id',
  [auth, roleCheck(['cab_driver'])],
  cabServiceController.deleteCabService
);

module.exports = router;