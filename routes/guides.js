const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

// @route   GET api/guides
// @desc    Get all guides
// @access  Public
router.get('/', guideController.getAllGuides);

// @route   GET api/guides/search
// @desc    Search guides by language or specialization
// @access  Public
router.get('/search', guideController.searchGuides);

// @route   GET api/guides/:id
// @desc    Get guide by ID
// @access  Public
router.get('/:id', guideController.getGuideById);

// @route   POST api/guides
// @desc    Create a guide
// @access  Private + guide only
router.post(
  '/',
  [auth, roleCheck(['guide']), upload.array('images', 5)],
  guideController.createGuide
);

// @route   PUT api/guides/:id
// @desc    Update a guide
// @access  Private + guide only
router.put(
  '/:id',
  [auth, roleCheck(['guide']), upload.array('images', 5)],
  guideController.updateGuide
);

// @route   DELETE api/guides/:id
// @desc    Delete a guide
// @access  Private + guide only
router.delete(
  '/:id',
  [auth, roleCheck(['guide'])],
  guideController.deleteGuide
);

// @route   DELETE api/guides/:id/images/:imageIndex
// @desc    Delete a specific image from a guide
// @access  Private + guide only
router.delete(
  '/:id/images/:imageIndex',
  [auth, roleCheck(['guide'])],
  guideController.deleteGuideImage
);

module.exports = router;