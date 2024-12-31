const express = require('express');
const DayTemplateController = require('../controllers/DayTemplateController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);  // Apply auth middleware to all routes

// Routes that require login to view
router.get('/', DayTemplateController.getAll);
router.get('/:id', DayTemplateController.getOne);

// Routes that require login + sales department
router.post('/', DayTemplateController.create);
router.put('/:id', DayTemplateController.update);
router.delete('/:id', DayTemplateController.delete);
router.patch('/:id/restore', DayTemplateController.restore);

module.exports = router; 