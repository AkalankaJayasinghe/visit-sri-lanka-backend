const express = require('express');
const router = express.Router();
const {
  getUserTripPlans,
  getTripPlanById,
  createTripPlan,
  updateTripPlan,
  deleteTripPlan
} = require('../controllers/tripPlanController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/trip-plans
// @desc    Get all trip plans for a user
// @access  Private
router.get('/', auth, getUserTripPlans);

// @route   GET api/trip-plans/:id
// @desc    Get trip plan by ID
// @access  Private
router.get('/:id', auth, getTripPlanById);

// @route   POST api/trip-plans
// @desc    Create a trip plan
// @access  Private + tourist only
router.post(
  '/',
  [auth, roleCheck(['tourist'])],
  createTripPlan
);

// @route   PUT api/trip-plans/:id
// @desc    Update a trip plan
// @access  Private + tourist only
router.put(
  '/:id',
  [auth, roleCheck(['tourist'])],
  updateTripPlan
);

// @route   DELETE api/trip-plans/:id
// @desc    Delete a trip plan
// @access  Private + tourist only
router.delete(
  '/:id',
  [auth, roleCheck(['tourist'])],
  deleteTripPlan
);

module.exports = router;