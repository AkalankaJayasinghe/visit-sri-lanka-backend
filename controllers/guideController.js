const Guide = require('../models/Guide');

const guideController = {
  // Get all guides
  getAllGuides: async (req, res) => {
    try {
      const guides = await Guide.find();
      res.json(guides);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get single guide
  getGuideById: async (req, res) => {
    try {
      const guide = await Guide.findById(req.params.id);
      if (!guide) {
        return res.status(404).json({ message: 'Guide not found' });
      }
      res.json(guide);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create guide
  createGuide: async (req, res) => {
    try {
      const newGuide = new Guide({
        ...req.body,
        ownerId: req.user.id
      });

      const guide = await newGuide.save();
      res.status(201).json(guide);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Update guide
  updateGuide: async (req, res) => {
    try {
      const guide = await Guide.findById(req.params.id);
      
      if (!guide) {
        return res.status(404).json({ message: 'Guide not found' });
      }

      // Check ownership
      if (guide.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const updatedGuide = await Guide.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.json(updatedGuide);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Delete guide
  deleteGuide: async (req, res) => {
    try {
      const guide = await Guide.findById(req.params.id);
      
      if (!guide) {
        return res.status(404).json({ message: 'Guide not found' });
      }

      // Check ownership
      if (guide.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await guide.deleteOne(); // Using deleteOne() instead of remove()
      res.json({ message: 'Guide removed' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Search guides by language or specialization
  searchGuides: async (req, res) => {
    try {
      const { language, specialization } = req.query;
      let searchQuery = {};

      if (language) {
        searchQuery.languages = { $regex: language, $options: 'i' };
      }

      if (specialization) {
        searchQuery.specializations = { $regex: specialization, $options: 'i' };
      }

      const guides = await Guide.find(searchQuery);
      res.json(guides);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = guideController;