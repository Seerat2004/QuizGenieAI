const express = require('express');
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Admin
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to get users' });
  }
});

// @route   GET /api/admin/attempts
// @desc    Get all quiz attempts (admin only)
// @access  Admin
router.get('/attempts', protect, authorize('admin'), async (req, res) => {
  try {
    const attempts = await QuizAttempt.find().populate('userId', 'username email').populate('quizId', 'title subject');
    res.json({ success: true, data: attempts });
  } catch (error) {
    console.error('Admin get attempts error:', error);
    res.status(500).json({ success: false, message: 'Failed to get attempts' });
  }
});

module.exports = router; 