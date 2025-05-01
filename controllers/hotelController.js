const Hotel = require('../models/Hotel');

const hotelController = {
  // Get all hotels
  getAllHotels: async (req, res) => {
    try {
      const hotels = await Hotel.find();
      res.json(hotels);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get single hotel
  getHotelById: async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      res.json(hotel);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create hotel
  createHotel: async (req, res) => {
    try {
      const newHotel = new Hotel({
        ...req.body,
        ownerId: req.user.id
      });

      const hotel = await newHotel.save();
      res.status(201).json(hotel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Update hotel
  updateHotel: async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Check ownership
      if (hotel.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.json(updatedHotel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Delete hotel
  deleteHotel: async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Check ownership
      if (hotel.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await hotel.remove();
      res.json({ message: 'Hotel removed' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Search hotels by location
  searchHotelsByLocation: async (req, res) => {
    try {
      const { city } = req.query;
      const hotels = await Hotel.find({
        'location.city': { $regex: city, $options: 'i' }
      });
      res.json(hotels);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = hotelController;