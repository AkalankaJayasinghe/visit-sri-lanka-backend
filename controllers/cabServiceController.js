const CabService = require('../models/CabService');

const cabServiceController = {
  // Get all cab services
  getAllCabServices: async (req, res) => {
    try {
      const cabServices = await CabService.find();
      res.json(cabServices);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get single cab service
  getCabServiceById: async (req, res) => {
    try {
      const cabService = await CabService.findById(req.params.id);
      if (!cabService) {
        return res.status(404).json({ message: 'Cab service not found' });
      }
      res.json(cabService);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create cab service
  createCabService: async (req, res) => {
    try {
      const newCabService = new CabService({
        ...req.body,
        ownerId: req.user.id
      });

      const cabService = await newCabService.save();
      res.status(201).json(cabService);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Update cab service
  updateCabService: async (req, res) => {
    try {
      const cabService = await CabService.findById(req.params.id);
      
      if (!cabService) {
        return res.status(404).json({ message: 'Cab service not found' });
      }

      // Check ownership
      if (cabService.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const updatedCabService = await CabService.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.json(updatedCabService);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Delete cab service
  deleteCabService: async (req, res) => {
    try {
      const cabService = await CabService.findById(req.params.id);
      
      if (!cabService) {
        return res.status(404).json({ message: 'Cab service not found' });
      }

      // Check ownership
      if (cabService.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await cabService.deleteOne(); // Using deleteOne() instead of remove()
      res.json({ message: 'Cab service removed' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Search cab services by area
  searchCabServicesByArea: async (req, res) => {
    try {
      const { area } = req.query;
      const cabServices = await CabService.find({
        operatingAreas: { $regex: area, $options: 'i' }
      });
      res.json(cabServices);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = cabServiceController;