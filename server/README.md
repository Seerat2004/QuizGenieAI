# QuizGenieAI Backend

A robust Node.js backend for the QuizGenieAI application with MongoDB Atlas, JWT authentication, and bcrypt password hashing.

## 🚀 Features

- **Authentication System**: JWT-based authentication with bcrypt password hashing
- **User Management**: Complete user registration, login, and profile management
- **Quiz System**: Create, manage, and attempt quizzes with detailed analytics
- **Role-Based Access**: Student, Teacher, and Admin roles with appropriate permissions
- **MongoDB Atlas**: Cloud-based database with optimized schemas and indexes
- **Security**: Helmet, CORS, input validation, and error handling
- **API Documentation**: RESTful API with comprehensive endpoints

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository and navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `config.env` and update with your values:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/quizgenie?retryWrites=true&w=majority

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=7d

   # CORS Configuration
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

## 🗄️ Database Setup

### MongoDB Atlas Configuration

1. Create a MongoDB Atlas account at [mongodb.com](https://mongodb.com)
2. Create a new cluster
3. Set up database access (username/password)
4. Set up network access (IP whitelist or 0.0.0.0/0 for development)
5. Get your connection string and update `MONGODB_URI` in `config.env`

### Database Collections

The application automatically creates the following collections:
- `users` - User accounts and profiles
- `quizzes` - Quiz definitions and questions
- `quizattempts` - User quiz attempts and results

## 🔐 Authentication

### JWT Token Structure
```javascript
{
  id: "user_id",
  email: "user@example.com",
  username: "username",
  role: "student|teacher|admin"
}
```

### Protected Routes
Most routes require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📚 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/change-password` - Change password

### User Routes
- `GET /api/users/profile` - Get user profile
- `GET /api/users/quiz-history` - Get quiz history
- `GET /api/users/stats` - Get user statistics
- `PUT /api/users/preferences` - Update preferences
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/:id` - Get public user profile

### Quiz Routes
- `GET /api/quizzes` - Get all quizzes (with filtering)
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes/:id/start` - Start quiz attempt
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/:id/result/:attemptId` - Get quiz result
- `POST /api/quizzes` - Create quiz (admin/teacher)
- `PUT /api/quizzes/:id` - Update quiz (admin/teacher)
- `DELETE /api/quizzes/:id` - Delete quiz (admin/teacher)

## 🔒 Role-Based Access

### Student Role
- Take quizzes
- View results and analytics
- Update personal profile
- View leaderboard

### Teacher Role
- All student permissions
- Create and manage quizzes
- View student performance
- Access analytics

### Admin Role
- All teacher permissions
- Manage all users
- System-wide analytics
- Full administrative access

## 📊 Data Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  avatar: String,
  role: 'student' | 'teacher' | 'admin',
  isActive: Boolean,
  lastLogin: Date,
  quizHistory: Array,
  preferences: Object
}
```

### Quiz Model
```javascript
{
  title: String,
  description: String,
  subject: String,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  questions: Array,
  timeLimit: Number,
  createdBy: ObjectId,
  isActive: Boolean,
  totalAttempts: Number,
  averageScore: Number
}
```

### QuizAttempt Model
```javascript
{
  userId: ObjectId,
  quizId: ObjectId,
  startTime: Date,
  endTime: Date,
  status: 'in_progress' | 'completed' | 'abandoned',
  answers: Array,
  score: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  timeSpent: Number,
  feedback: String,
  aiAnalysis: Object
}
```

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds of 12
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Express-validator for all inputs
- **CORS Protection**: Configurable CORS settings
- **Helmet**: Security headers
- **Rate Limiting**: Built-in protection against abuse
- **Error Handling**: Comprehensive error management

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Example API Calls

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-domain.com
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start index.js --name quizgenie-backend
pm2 save
pm2 startup
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

## 🔧 Configuration

### CORS Settings
Update `CLIENT_URL` in `config.env` to match your frontend URL.

### JWT Settings
- `JWT_SECRET`: Use a strong, random secret key
- `JWT_EXPIRE`: Token expiration time (default: 7 days)

### Database Settings
- `MONGODB_URI`: Your MongoDB Atlas connection string
- Ensure proper network access and authentication

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your connection string
   - Verify network access settings
   - Ensure username/password are correct

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header format

3. **CORS Errors**
   - Update CLIENT_URL in config.env
   - Check frontend URL matches CORS settings

### Logs
The server uses Morgan for HTTP logging and console logging for errors. Check the console output for detailed error messages.

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check server logs for error details
4. Verify environment configuration

## 🔄 Updates

To update the backend:
1. Pull latest changes
2. Run `npm install` to update dependencies
3. Restart the server
4. Check for any new environment variables

---

**QuizGenieAI Backend** - Powered by Node.js, Express, MongoDB Atlas, and JWT Authentication 