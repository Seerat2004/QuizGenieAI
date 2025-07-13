const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Question ID is required']
  },
  selectedAnswer: {
    type: String,
    required: [true, 'Selected answer is required']
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required']
  },
  isCorrect: {
    type: Boolean,
    required: [true, 'isCorrect flag is required']
  }
});

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Quiz ID is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
    default: Date.now
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  answers: [answerSchema],
  score: {
    type: Number,
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100']
  },
  totalQuestions: {
    type: Number,
    min: [1, 'Total questions must be at least 1']
  },
  correctAnswers: {
    type: Number,
    min: [0, 'Correct answers cannot be negative']
  },
  timeSpent: {
    type: Number, // in seconds
    min: [0, 'Time spent cannot be negative']
  },
  feedback: {
    type: String,
    trim: true
  },
  aiAnalysis: {
    weakTopics: [{
      topic: String,
      score: Number
    }],
    recommendations: [String],
    overallFeedback: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
quizAttemptSchema.index({ userId: 1, quizId: 1 });
quizAttemptSchema.index({ userId: 1, status: 1 });
quizAttemptSchema.index({ quizId: 1 });
quizAttemptSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate time spent
quizAttemptSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.timeSpent = Math.floor((this.endTime - this.startTime) / 1000); // Convert to seconds
  }
  next();
});

// Instance method to get attempt summary
quizAttemptSchema.methods.getSummary = function() {
  return {
    id: this._id,
    quizId: this.quizId,
    status: this.status,
    score: this.score,
    totalQuestions: this.totalQuestions,
    correctAnswers: this.correctAnswers,
    timeSpent: this.timeSpent,
    startTime: this.startTime,
    endTime: this.endTime,
    createdAt: this.createdAt
  };
};

// Instance method to get detailed results
quizAttemptSchema.methods.getDetailedResults = function() {
  return {
    id: this._id,
    quizId: this.quizId,
    status: this.status,
    score: this.score,
    totalQuestions: this.totalQuestions,
    correctAnswers: this.correctAnswers,
    timeSpent: this.timeSpent,
    startTime: this.startTime,
    endTime: this.endTime,
    answers: this.answers,
    feedback: this.feedback,
    aiAnalysis: this.aiAnalysis,
    createdAt: this.createdAt
  };
};

// Static method to get user's quiz attempts
quizAttemptSchema.statics.findByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, status, quizId } = options;
  
  const query = { userId };
  if (status) query.status = status;
  if (quizId) query.quizId = quizId;

  return this.find(query)
    .populate('quizId', 'title subject difficulty')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to get quiz statistics
quizAttemptSchema.statics.getQuizStats = function(quizId) {
  return this.aggregate([
    { $match: { quizId: new mongoose.Types.ObjectId(quizId), status: 'completed' } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$score' },
        highestScore: { $max: '$score' },
        lowestScore: { $min: '$score' },
        averageTimeSpent: { $avg: '$timeSpent' }
      }
    }
  ]);
};

// Static method to get user statistics
quizAttemptSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'completed' } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$score' },
        highestScore: { $max: '$score' },
        totalQuestions: { $sum: '$totalQuestions' },
        totalCorrectAnswers: { $sum: '$correctAnswers' },
        totalTimeSpent: { $sum: '$timeSpent' }
      }
    }
  ]);
};

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema); 