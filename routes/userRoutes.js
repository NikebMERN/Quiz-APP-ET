const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Public route for user registration
router.post('/register', userController.registerUser);

// Public route for user login
router.post('/login', userController.loginUser);

// Private route for getting user information (requires authentication)
router.get('/user-info', authenticateUser, userController.getUserInfo);

// Private route for getting all user information
router.get('/users-info', userController.getAllUserInfo);

// Public route for user IQ point updating
router.post('/update-iq-points', userController.updateIqPoints);

module.exports = router;
