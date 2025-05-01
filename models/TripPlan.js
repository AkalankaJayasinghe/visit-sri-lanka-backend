const mongoose = require('mongoose');

const tripPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  hotels: [{
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel'
    },
    checkIn: Date,
    checkOut: Date
  }],
  restaurants: [{
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    },
    date: Date,
    time: String
  }],
  cabServices: [{
    cabServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CabService'
    },
    date: Date,
    pickup: String,
    dropoff: String
  }],
  guides: [{
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guide'
    },
    startDate: Date,
    endDate: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TripPlan', tripPlanSchema);