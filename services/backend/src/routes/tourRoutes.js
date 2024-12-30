const express = require('express');
const TourController = require('../controllers/tourController');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/tours
 * @desc    Create a new tour
 * @access  Private
 */
router.post('/', auth, TourController.createTour);

/**
 * @route   GET /api/tours
 * @desc    Get all tours with filters and pagination
 * @access  Private
 */
router.get('/', auth, TourController.getTours);

/**
 * @route   GET /api/tours/:id
 * @desc    Get single tour by ID
 * @access  Private
 */
router.get('/:id', auth, TourController.getTour);

/**
 * @route   PUT /api/tours/:id
 * @desc    Update tour
 * @access  Private
 */
router.put('/:id', auth, TourController.updateTour);

/**
 * @route   DELETE /api/tours/:id
 * @desc    Delete tour
 * @access  Private
 */
router.delete('/:id', auth, TourController.deleteTour);

/**
 * @route   PUT /api/tours/:id/status
 * @desc    Update tour status
 * @access  Private
 */
router.put('/:id/status', auth, TourController.updateTourStatus);

module.exports = router;