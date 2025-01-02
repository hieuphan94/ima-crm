const express = require('express');
const router = express.Router();
const TourController = require('../controllers/TourController');
const TourDayController = require('../controllers/TourDayController');
const { auth, isAdmin } = require('../middleware/auth');

// Tour routes
router.get('/', auth, TourController.getAll);

router.get('/:id', auth, TourController.getOne);

router.post('/', auth, isAdmin, TourController.create);

router.put('/:id', auth, isAdmin, TourController.update);

router.delete('/:id', auth, isAdmin, TourController.delete);

router.patch('/:id/restore', auth, isAdmin, TourController.restore);

router.patch('/:id/status', auth, isAdmin, TourController.updateStatus);

// Tour day routes (nested under tours)
router.get('/:tourId/days', auth, TourDayController.getDays);

router.post('/:tourId/days', auth, isAdmin, TourDayController.create);

router.put('/:tourId/days/:dayId', auth, isAdmin, TourDayController.update);

router.delete('/:tourId/days/:dayId', auth, isAdmin, TourDayController.delete);

router.patch('/:tourId/days/reorder', auth, isAdmin, TourDayController.reorder);

module.exports = router;