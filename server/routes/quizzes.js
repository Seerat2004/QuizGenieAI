const express = require('express');
const { body, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// @route   GET /api/quizzes
// @desc    Get all quizzes with filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      subject, 
      difficulty, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };
    
    if (subject) {
      query.subject = { $in: Array.isArray(subject) ? subject : [subject] };
    }
    
    if (difficulty) {
      query.difficulty = { $in: Array.isArray(difficulty) ? difficulty : [difficulty] };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const quizzes = await Quiz.find(query)
      .select('-questions.answers')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Quiz.countDocuments(query);

    // Add user attempt info if authenticated
    let quizzesWithAttempts = quizzes;
    if (req.user) {
      const userAttempts = await QuizAttempt.find({
        userId: req.user._id,
        quizId: { $in: quizzes.map(q => q._id) }
      }).select('quizId score completedAt');

      quizzesWithAttempts = quizzes.map(quiz => {
        const attempt = userAttempts.find(a => a.quizId.toString() === quiz._id.toString());
        return {
          ...quiz.toObject(),
          userAttempt: attempt ? {
            score: attempt.score,
            completedAt: attempt.completedAt
          } : null
        };
      });
    }

    res.json({
      success: true,
      data: {
        quizzes: quizzesWithAttempts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalQuizzes: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quizzes'
    });
  }
});

// @route   GET /api/quizzes/:id/result/:attemptId
// @desc    Get quiz result with detailed analysis
// @access  Private
router.get('/:id/result/:attemptId', protect, async (req, res) => {
  try {
    const { id: quizId, attemptId } = req.params;

    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      userId: req.user._id,
      quizId: quizId
    }).populate('quizId');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }

    const quiz = attempt.quizId;
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate performance metrics
    const performance = {
      score: attempt.score,
      correctAnswers: attempt.correctAnswers,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.score,
      timeTaken: attempt.endTime - attempt.startTime,
      questions: attempt.answers.map(answer => {
        const question = quiz.questions.find(q => q._id.toString() === answer.questionId.toString());
        console.log('Result debug:', {
          answer,
          foundQuestion: question
        });
        return {
          question: question?.text || 'Question not found',
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: answer.correctAnswer,
          isCorrect: answer.isCorrect,
          explanation: question?.explanation || ''
        };
      })
    };

    const aiAnalysis = attempt.aiAnalysis || null;

    res.json({
      success: true,
      data: {
        performance,
        attempt: {
          id: attempt._id,
          startTime: attempt.startTime,
          endTime: attempt.endTime,
          status: attempt.status
        },
        aiAnalysis
      }
    });
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get result'
    });
  }
});

// @route   POST /api/quizzes/:id/start
// @desc    Start a quiz attempt
// @access  Private
router.post('/:id/start', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz || !quiz.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Remove the check for existing active attempts to allow unlimited attempts
    // const existingAttempt = await QuizAttempt.findOne({
    //   userId: req.user._id,
    //   quizId: quiz._id,
    //   status: 'in_progress'
    // });

    // if (existingAttempt) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'You already have an active attempt for this quiz'
    //   });
    // }

    // Create new attempt
    const attempt = new QuizAttempt({
      userId: req.user._id,
      quizId: quiz._id,
      startTime: new Date(),
      status: 'in_progress'
    });

    await attempt.save();

    // Return quiz with options (not answers)
    const quizWithOptions = {
      ...quiz.toObject(),
      questions: quiz.questions.map(q => ({
        _id: q._id,
        text: q.text,
        options: q.answers.map(a => a.text),
        explanation: q.explanation,
        points: q.points
      }))
    };

    res.json({
      success: true,
      message: 'Quiz started successfully',
      data: {
        quiz: quizWithOptions,
        attemptId: attempt._id
      }
    });
  } catch (error) {
    console.error('Start quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start quiz'
    });
  }
});

// @route   POST /api/quizzes/:id/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/:id/submit', protect, [
  body('answers')
    .isArray()
    .withMessage('Answers must be an array'),
  body('answers.*.questionId')
    .isMongoId()
    .withMessage('Invalid question ID'),
  body('answers.*.selectedAnswer')
    .isString()
    .withMessage('Selected answer must be a string')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz || !quiz.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Find active attempt using attemptId
    const { attemptId } = req.body;
    console.log('Quiz submit debug:', {
      attemptId,
      userId: req.user._id,
      quizId: quiz._id
    });
    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      userId: req.user._id,
      quizId: quiz._id,
      status: 'in_progress'
    });
    if (!attempt) {
      // Debug: log all attempts for this user and quiz
      const allAttempts = await QuizAttempt.find({
        userId: req.user._id,
        quizId: quiz._id
      });
      console.error('No active attempt found. All attempts for user/quiz:', allAttempts);
      return res.status(400).json({
        success: false,
        message: 'No active attempt found for this quiz',
        debug: {
          attemptId,
          userId: req.user._id,
          quizId: quiz._id,
          allAttempts
        }
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    const detailedAnswers = [];

    for (const answer of answers) {
      // Log the IDs being compared
      console.log('Scoring debug:', {
        submittedQuestionId: answer.questionId,
        quizQuestionIds: quiz.questions.map(q => q._id.toString())
      });
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId.toString());
      if (question) {
        const isCorrect = question.answers.find(a => a.isCorrect)?.text === answer.selectedAnswer;
        if (isCorrect) correctAnswers++;
        detailedAnswers.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question.answers.find(a => a.isCorrect)?.text,
          isCorrect
        });
      } else {
        console.error('No matching question found for submitted answer:', answer);
      }
    }

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Update attempt
    attempt.answers = detailedAnswers;
    attempt.score = score;
    attempt.totalQuestions = totalQuestions;
    attempt.correctAnswers = correctAnswers;
    attempt.endTime = new Date();
    attempt.status = 'completed';
    await attempt.save();

    // Update user's quiz history
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        quizHistory: {
          quizId: quiz._id,
          score: score,
          totalQuestions: totalQuestions,
          completedAt: new Date()
        }
      }
    });

    // --- AI Feedback Integration (async) ---
    (async () => {
      let aiAnalysis = null;
      try {
        // Build detailed question results for the prompt
        const detailedResults = detailedAnswers.map((a, i) => {
          const q = quiz.questions.find(q => q._id.toString() === a.questionId.toString());
          return `Q${i+1}:
Question: ${q?.text || 'N/A'}
Your Answer: ${a.selectedAnswer}
Correct Answer: ${a.correctAnswer}
${a.isCorrect ? 'Result: Correct' : 'Result: Incorrect'}${q?.explanation ? `\nExplanation: ${q.explanation}` : ''}`;
        }).join('\n\n');
        // Prepare improved prompt for feedback
        const prompt = `A student just completed a quiz titled "${quiz.title}" on the subject "${quiz.subject}".\n\nScore: ${score}/${100}\nCorrect Answers: ${correctAnswers}/${totalQuestions}\nTime Spent: ${attempt.timeSpent || 'N/A'} seconds\n\nHere is a detailed review of the questions and results:\n${detailedResults}\n\nPlease provide:\n1. A short, encouraging feedback paragraph for the student.\n2. For each incorrect answer, provide a detailed explanation and what the student should review.\n3. List any weak topics or concepts based on their answers.\n4. Recommend what to study or which quizzes to take next.\nRespond with ONLY valid JSON, no extra text, no markdown, no explanation. Format: {\"overallFeedback\": string, \"detailedFeedback\": array, \"weakTopics\": array, \"recommendations\": array}`;

        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'openrouter/auto',
            messages: [
              { role: 'system', content: 'You are an educational AI assistant.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1500
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://quizgenieai.local',
              'X-Title': 'QuizGenieAI'
            }
          }
        );
        let aiText = response.data.choices[0].message.content;
        // Extract first JSON object from the response, even if extra text is present
        let jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            aiAnalysis = JSON.parse(jsonMatch[0]);
          } catch (e) {
            console.error('AI feedback JSON parse error:', e, 'Extracted JSON:', jsonMatch[0]);
          }
        } else {
          console.error('No JSON object found in AI response:', aiText);
        }
        // Transform weakTopics to array of objects if it's an array of strings
        if (aiAnalysis && Array.isArray(aiAnalysis.weakTopics)) {
          aiAnalysis.weakTopics = aiAnalysis.weakTopics.map(wt =>
            typeof wt === 'string' ? { topic: wt } : wt
          );
        }
        attempt.aiAnalysis = aiAnalysis;
        await attempt.save();
      } catch (aiErr) {
        console.error('AI feedback integration error:', aiErr);
        aiAnalysis = { overallFeedback: 'AI feedback is currently unavailable. Please try again later.', detailedFeedback: [], weakTopics: [], recommendations: [] };
        attempt.aiAnalysis = aiAnalysis;
        await attempt.save();
      }
    })();
    // --- End AI Feedback Integration (async) ---

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score, // percentage
        correctAnswers,
        totalQuestions,
        attemptId: attempt._id
        // aiAnalysis will be available on result fetch
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz'
    });
  }
});

// Admin routes for quiz management
// @route   POST /api/quizzes
// @desc    Create a new quiz (admin only)
// @access  Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ success: false, message: 'Failed to create quiz' });
  }
});

// @route   PUT /api/quizzes/:id
// @desc    Edit a quiz (admin only)
// @access  Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    res.json({ success: true, data: quiz });
  } catch (error) {
    console.error('Edit quiz error:', error);
    res.status(500).json({ success: false, message: 'Failed to edit quiz' });
  }
});

// @route   DELETE /api/quizzes/:id
// @desc    Delete a quiz (admin only)
// @access  Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete quiz' });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get quiz by ID (without answers)
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.answers')
      .populate('createdBy', 'username firstName lastName');

    if (!quiz || !quiz.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Add user attempt info if authenticated
    let quizData = quiz.toObject();
    if (req.user) {
      const attempt = await QuizAttempt.findOne({
        userId: req.user._id,
        quizId: quiz._id
      }).select('score completedAt');

      if (attempt) {
        quizData.userAttempt = {
          score: attempt.score,
          completedAt: attempt.completedAt
        };
      }
    }

    res.json({
      success: true,
      data: {
        quiz: quizData
      }
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quiz'
    });
  }
});

module.exports = router; 