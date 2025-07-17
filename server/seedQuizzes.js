const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
require('dotenv').config({ path: './config.env' });

// Use the correct MongoDB URI from config.env
let MONGO_URI = process.env.MONGODB_URI;
// Ensure the database name is quizgenie
if (MONGO_URI && !/quizgenie/.test(MONGO_URI)) {
  // Insert /quizgenie before the first ?
  MONGO_URI = MONGO_URI.replace(/(mongodb.*?\.net)(\/?)(\?|$)/, '$1/quizgenie$3');
}

// Use a placeholder ObjectId for createdBy (replace with a real user _id in production)
const placeholderUserId = new mongoose.Types.ObjectId();

const quizzes = [
  {
    title: 'Algebra Basics',
    description: 'Test your skills in algebraic equations and expressions.',
    subject: 'Mathematics',
    difficulty: 'Easy',
    questions: [
      {
        text: 'What is the value of x in 2x + 3 = 7?',
        answers: [
          { text: '1', isCorrect: false },
          { text: '2', isCorrect: true },
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: false }
        ],
        explanation: '2x + 3 = 7 => 2x = 4 => x = 2',
        points: 1
      },
      {
        text: 'Simplify: 3(x + 2) = ?',
        answers: [
          { text: '3x + 2', isCorrect: false },
          { text: '3x + 6', isCorrect: true },
          { text: 'x + 5', isCorrect: false },
          { text: '6x', isCorrect: false }
        ],
        explanation: '3(x + 2) = 3x + 6',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['algebra', 'basics'],
    isActive: true
  },
  {
    title: 'Physics Fundamentals',
    description: 'Challenge yourself with basic physics concepts.',
    subject: 'Science',
    difficulty: 'Hard',
    questions: [
      {
        text: 'What is the unit of force?',
        answers: [
          { text: 'Joule', isCorrect: false },
          { text: 'Newton', isCorrect: true },
          { text: 'Watt', isCorrect: false },
          { text: 'Pascal', isCorrect: false }
        ],
        explanation: 'The SI unit of force is Newton.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['physics', 'fundamentals'],
    isActive: true
  },
  {
    title: 'World History',
    description: 'Explore important events and figures from world history.',
    subject: 'History',
    difficulty: 'Medium',
    questions: [
      {
        text: 'Who was the first President of the United States?',
        answers: [
          { text: 'Abraham Lincoln', isCorrect: false },
          { text: 'George Washington', isCorrect: true },
          { text: 'John Adams', isCorrect: false },
          { text: 'Thomas Jefferson', isCorrect: false }
        ],
        explanation: 'George Washington was the first President.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['history', 'world'],
    isActive: true
  },
  {
    title: 'Literary Classics',
    description: 'Questions about famous books and authors.',
    subject: 'Literature',
    difficulty: 'Medium',
    questions: [
      {
        text: 'Who wrote "Pride and Prejudice"?',
        answers: [
          { text: 'Jane Austen', isCorrect: true },
          { text: 'Emily Brontë', isCorrect: false },
          { text: 'Charles Dickens', isCorrect: false },
          { text: 'Mark Twain', isCorrect: false }
        ],
        explanation: 'Jane Austen wrote "Pride and Prejudice".',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['literature', 'classics'],
    isActive: true
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB:', MONGO_URI);
    await Quiz.deleteMany({});
    await Quiz.insertMany(quizzes);
    console.log('Sample quizzes inserted!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed(); 