const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Answer text is required'],
    trim: true
  },
  isCorrect: {
    type: Boolean,
    required: [true, 'isCorrect flag is required'],
    default: false
  }
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  answers: {
    type: [answerSchema],
    required: [true, 'At least one answer is required'],
    validate: {
      validator: function(answers) {
        return answers.length >= 2 && answers.length <= 4;
      },
      message: 'Each question must have 2-4 answers'
    }
  },
  explanation: {
    type: String,
    trim: true,
    default: ''
  },
  points: {
    type: Number,
    default: 1
  }
});

// Validate that each question has exactly one correct answer
questionSchema.pre('save', function(next) {
  const correctAnswers = this.answers.filter(answer => answer.isCorrect);
  if (correctAnswers.length !== 1) {
    return next(new Error('Each question must have exactly one correct answer'));
  }
  next();
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: {
      values: ['Mathematics', 'Science', 'History', 'Geography', 'Literature', 'Computer Science', 'General Knowledge', 'Civics', 'DSA', 'Web Development'],
      message: 'Invalid subject'
    }
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: 'Invalid difficulty level'
    }
  },
  questions: {
    type: [questionSchema],
    required: [true, 'At least one question is required'],
    validate: {
      validator: function(questions) {
        return questions.length >= 1;
      },
      message: 'Quiz must have at least one question'
    }
  },
  timeLimit: {
    type: Number, // in minutes
    min: [1, 'Time limit must be at least 1 minute'],
    max: [180, 'Time limit cannot exceed 180 minutes']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
quizSchema.index({ subject: 1, difficulty: 1 });
quizSchema.index({ createdBy: 1 });
quizSchema.index({ isActive: 1 });
quizSchema.index({ title: 'text', description: 'text' });

// Instance method to get quiz without answers (for students)
quizSchema.methods.getPublicQuiz = function() {
  const quiz = this.toObject();
  quiz.questions = quiz.questions.map(question => {
    const { answers, ...questionWithoutAnswers } = question;
    return {
      ...questionWithoutAnswers,
      answers: answers.map(answer => ({
        text: answer.text,
        _id: answer._id
      }))
    };
  });
  return quiz;
};

// Static method to get quizzes by subject
quizSchema.statics.findBySubject = function(subject) {
  return this.find({ subject, isActive: true });
};

// Static method to get quizzes by difficulty
quizSchema.statics.findByDifficulty = function(difficulty) {
  return this.find({ difficulty, isActive: true });
};

// Static method to search quizzes
quizSchema.statics.search = function(searchTerm) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { subject: { $regex: searchTerm, $options: 'i' } }
        ]
      }
    ]
  });
};

module.exports = mongoose.model('Quiz', quizSchema); 