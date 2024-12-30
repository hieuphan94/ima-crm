const express = require('express');
const ServiceCategoryController = require('../controllers/ServiceCategoryController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);  // Apply auth middleware to all routes

// Routes that require login to view
router.get('/', ServiceCategoryController.getAll);
router.get('/:id', ServiceCategoryController.getById);

// Routes that require login + sales department
router.post('/', ServiceCategoryController.create);
router.put('/:id', ServiceCategoryController.update);
router.delete('/:id', ServiceCategoryController.delete);
router.patch('/:id/restore', ServiceCategoryController.restore);

module.exports = router; 