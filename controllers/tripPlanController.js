const TripPlan = require('../models/TripPlan');

// Get all trip plans for a user
exports.getUserTripPlans = async (req, res) => {
  try {
    const tripPlans = await TripPlan.find({ userId: req.user.id })
      .populate('hotels.hotelId')
      .populate('restaurants.restaurantId')
      .populate('cabServices.cabServiceId')
      .populate('guides.guideId');
    res.json(tripPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single trip plan
exports.getTripPlanById = async (req, res) => {
  try {
    const tripPlan = await TripPlan.findById(req.params.id)
      .populate('hotels.hotelId')
      .populate('restaurants.restaurantId')
      .populate('cabServices.cabServiceId')
      .populate('guides.guideId');
      
    if (!tripPlan) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    // Check ownership
    if (tripPlan.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(tripPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create trip plan
exports.createTripPlan = async (req, res) => {
  try {
    const newTripPlan = new TripPlan({
      ...req.body,
      userId: req.user.id
    });

    const tripPlan = await newTripPlan.save();
    res.status(201).json(tripPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update trip plan
exports.updateTripPlan = async (req, res) => {
  try {
    const tripPlan = await TripPlan.findById(req.params.id);
    
    if (!tripPlan) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    // Check ownership
    if (tripPlan.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedTripPlan = await TripPlan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedTripPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete trip plan
exports.deleteTripPlan = async (req, res) => {
  try {
    const tripPlan = await TripPlan.findById(req.params.id);
    
    if (!tripPlan) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    // Check ownership
    if (tripPlan.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await tripPlan.remove();
    res.json({ message: 'Trip plan removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};