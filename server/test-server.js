const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = 5000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Test routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'QuizGenieAI Backend is running (Test Mode)',
    timestamp: new Date().toISOString(),
    features: [
      'Express.js server',
      'CORS enabled',
      'Helmet security',
      'Morgan logging',
      'JSON parsing',
      'URL encoding'
    ]
  });
});

app.get('/api/test/auth', (req, res) => {
  res.json({
    message: 'Authentication endpoints will be available here',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/logout',
      'GET /api/auth/me'
    ]
  });
});

app.get('/api/test/quizzes', (req, res) => {
  res.json({
    message: 'Quiz endpoints will be available here',
    endpoints: [
      'GET /api/quizzes',
      'GET /api/quizzes/:id',
      'POST /api/quizzes/:id/start',
      'POST /api/quizzes/:id/submit'
    ]
  });
});

app.get('/api/test/users', (req, res) => {
  res.json({
    message: 'User endpoints will be available here',
    endpoints: [
      'GET /api/users/profile',
      'GET /api/users/quiz-history',
      'GET /api/users/stats',
      'PUT /api/users/preferences'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    availableRoutes: [
      '/api/health',
      '/api/test/auth',
      '/api/test/quizzes',
      '/api/test/users'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`📊 Environment: Test Mode (No Database)`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Test endpoints: http://localhost:${PORT}/api/test/`);
}); 