const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// const { authenticateUser, checkAdminRole } = require('../middlewares/authMiddleware');

// Admin Login
router.post('/login', adminController.loginAdmin);

module.exports = router;
