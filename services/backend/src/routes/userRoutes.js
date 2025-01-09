const express = require('express');
const UserController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes (require authentication)
router.get('/profile', auth, UserController.getProfile);
router.put('/profile', auth, UserController.updateProfile);
router.put('/change-password', auth, UserController.changePassword);

// Admin only routes
router.get('/users', auth, isAdmin, UserController.getUsers);
router.get('/users/:id', auth, isAdmin, UserController.getUserById);
router.put('/users/:id', auth, isAdmin, UserController.updateUserByAdmin); // Thêm route mới
router.put('/users/:id/status', auth, isAdmin, UserController.updateUserStatus);
router.delete('/users/:id', auth, isAdmin, UserController.deleteUser);
router.put('/users/:id/change-password', auth, isAdmin, UserController.changeUserPassword);

module.exports = router;