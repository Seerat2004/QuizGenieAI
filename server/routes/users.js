const express = require('express');
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.getProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
});

// @route   GET /api/users/quiz-history
// @desc    Get user's quiz history
// @access  Private
router.get('/quiz-history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('quizHistory.quizId', 'title subject difficulty')
      .select('quizHistory');

    res.json({
      success: true,
      data: {
        quizHistory: user.quizHistory
      }
    });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quiz history'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('quizHistory');
    
    const stats = {
      totalQuizzes: user.quizHistory.length,
      averageScore: 0,
      totalQuestions: 0,
      subjectsTaken: new Set(),
      recentActivity: [],
      streak: 0 // new field
    };

    if (user.quizHistory.length > 0) {
      const totalScore = user.quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
      stats.averageScore = Math.round((totalScore / user.quizHistory.length) * 100) / 100;
      
      stats.totalQuestions = user.quizHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
      
      // Get recent activity (last 5 quizzes)
      stats.recentActivity = user.quizHistory
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, 5);

      // Calculate streak (consecutive days with completed quizzes)
      const sorted = user.quizHistory
        .filter(q => q.completedAt)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
      let streak = 0;
      let prev = null;
      for (let i = 0; i < sorted.length; i++) {
        const curr = new Date(sorted[i].completedAt);
        if (i === 0) {
          streak = 1;
        } else {
          const diff = (prev - curr) / (1000 * 60 * 60 * 24);
          if (diff <= 1.1 && diff >= 0.9) {
            streak++;
          } else {
            break;
          }
        }
        prev = curr;
      }
      stats.streak = streak;
    }

    res.json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
  try {
    const { theme, notifications } = req.body;
    const updateData = {};

    if (theme !== undefined) {
      if (!['light', 'dark'].includes(theme)) {
        return res.status(400).json({
          success: false,
          message: 'Theme must be either light or dark'
        });
      }
      updateData['preferences.theme'] = theme;
    }

    if (notifications !== undefined) {
      if (typeof notifications !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'Notifications must be a boolean value'
        });
      }
      updateData['preferences.notifications'] = notifications;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: updatedUser.preferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard (top performers)
// @access  Public (with optional auth)
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const { limit = 10, subject } = req.query;
    
    let matchStage = {};
    if (subject) {
      matchStage['quizHistory.quizId.subject'] = subject;
    }

    const leaderboard = await User.aggregate([
      {
        $unwind: '$quizHistory'
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quizHistory.quizId',
          foreignField: '_id',
          as: 'quiz'
        }
      },
      {
        $unwind: '$quiz'
      },
      {
        $match: matchStage
      },
      {
        $group: {
          _id: '$_id',
          username: { $first: '$username' },
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          avatar: { $first: '$avatar' },
          totalScore: { $sum: '$quizHistory.score' },
          totalQuestions: { $sum: '$quizHistory.totalQuestions' },
          quizCount: { $sum: 1 }
        }
      },
      {
        $addFields: {
          averageScore: {
            $cond: {
              if: { $eq: ['$totalQuestions', 0] },
              then: 0,
              else: { $divide: ['$totalScore', '$totalQuestions'] }
            }
          }
        }
      },
      {
        $sort: { averageScore: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          _id: 1,
          username: 1,
          firstName: 1,
          lastName: 1,
          avatar: 1,
          totalScore: 1,
          totalQuestions: 1,
          quizCount: 1,
          averageScore: { $round: ['$averageScore', 2] }
        }
      }
    ]);

    // Calculate user rank
    const allUsers = await User.aggregate([
      {
        $unwind: '$quizHistory'
      },
      {
        $group: {
          _id: '$_id',
          username: { $first: '$username' },
          totalScore: { $sum: '$quizHistory.score' },
          totalQuestions: { $sum: '$quizHistory.totalQuestions' }
        }
      },
      {
        $addFields: {
          averageScore: {
            $cond: {
              if: { $eq: ['$totalQuestions', 0] },
              then: 0,
              else: { $divide: ['$totalScore', '$totalQuestions'] }
            }
          }
        }
      },
      {
        $sort: { averageScore: -1 }
      }
    ]);
    let userRank = null;
    if (req.user) {
      const idx = allUsers.findIndex(u => u.username === req.user.username);
      userRank = idx >= 0 ? idx + 1 : null;
    }

    res.json({
      success: true,
      data: {
        leaderboard,
        userRank
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard'
    });
  }
});

// @route   GET /api/users/attempts
// @desc    Get user's quiz attempts (history)
// @access  Private
router.get('/attempts', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const attempts = await QuizAttempt.findByUser(req.user._id, { page, limit });
    res.json({
      success: true,
      data: { attempts }
    });
  } catch (error) {
    console.error('Get user attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user attempts'
    });
  }
});

// Admin routes
// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (public profile)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username firstName lastName avatar role quizHistory createdAt')
      .populate('quizHistory.quizId', 'title subject difficulty');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate public stats
    const publicStats = {
      totalQuizzes: user.quizHistory.length,
      averageScore: 0,
      totalQuestions: 0
    };

    if (user.quizHistory.length > 0) {
      const totalScore = user.quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
      publicStats.averageScore = Math.round((totalScore / user.quizHistory.length) * 100) / 100;
      publicStats.totalQuestions = user.quizHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          role: user.role,
          stats: publicStats,
          joinedAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
});

// @route   PUT /api/users/:id/status
// @desc    Update user status (admin only)
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

module.exports = router; 