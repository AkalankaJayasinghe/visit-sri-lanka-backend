const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  amenities: [String],
  rooms: [{
    type: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    capacity: Number,
    amenities: [String]
  }],
  images: [String],
  socialLinks: {
    website: String,
    facebook: String,
    instagram: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hotel', hotelSchema);