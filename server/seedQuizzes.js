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
  // Mathematics
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
      },
      {
        text: 'What is the solution to x^2 = 9?',
        answers: [
          { text: 'x = 3', isCorrect: false },
          { text: 'x = -3', isCorrect: false },
          { text: 'x = 3 or x = -3', isCorrect: true },
          { text: 'x = 0', isCorrect: false }
        ],
        explanation: 'x^2 = 9 => x = ±3',
        points: 1
      },
      {
        text: 'Which of the following is a linear equation?',
        answers: [
          { text: 'x^2 + 2x = 0', isCorrect: false },
          { text: '2x + 3 = 7', isCorrect: true },
          { text: 'x^3 - 1 = 0', isCorrect: false },
          { text: 'x^2 - 4 = 0', isCorrect: false }
        ],
        explanation: '2x + 3 = 7 is linear.',
        points: 1
      },
      {
        text: 'What is the value of y if y/2 = 8?',
        answers: [
          { text: '4', isCorrect: false },
          { text: '8', isCorrect: false },
          { text: '16', isCorrect: true },
          { text: '2', isCorrect: false }
        ],
        explanation: 'y/2 = 8 => y = 16',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['algebra', 'basics'],
    isActive: true
  },
  {
    title: 'Geometry Essentials',
    description: 'Fundamental questions about geometry.',
    subject: 'Mathematics',
    difficulty: 'Easy',
    questions: [
      {
        text: 'What is the sum of angles in a triangle?',
        answers: [
          { text: '90°', isCorrect: false },
          { text: '180°', isCorrect: true },
          { text: '360°', isCorrect: false },
          { text: '270°', isCorrect: false }
        ],
        explanation: 'Sum of angles in a triangle is 180°.',
        points: 1
      },
      {
        text: 'A right angle is:',
        answers: [
          { text: '45°', isCorrect: false },
          { text: '60°', isCorrect: false },
          { text: '90°', isCorrect: true },
          { text: '120°', isCorrect: false }
        ],
        explanation: 'A right angle is 90°.',
        points: 1
      },
      {
        text: 'Which shape has all sides equal and all angles equal?',
        answers: [
          { text: 'Rectangle', isCorrect: false },
          { text: 'Square', isCorrect: true },
          { text: 'Rhombus', isCorrect: false },
          { text: 'Trapezium', isCorrect: false }
        ],
        explanation: 'A square has all sides and angles equal.',
        points: 1
      },
      {
        text: 'The longest side of a right triangle is called:',
        answers: [
          { text: 'Base', isCorrect: false },
          { text: 'Height', isCorrect: false },
          { text: 'Hypotenuse', isCorrect: true },
          { text: 'Median', isCorrect: false }
        ],
        explanation: 'The hypotenuse is the longest side.',
        points: 1
      },
      {
        text: 'What is the area of a rectangle with length 5 and width 3?',
        answers: [
          { text: '8', isCorrect: false },
          { text: '15', isCorrect: true },
          { text: '10', isCorrect: false },
          { text: '18', isCorrect: false }
        ],
        explanation: 'Area = length × width = 5 × 3 = 15.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['geometry', 'basics'],
    isActive: true
  },
  // Physics Fundamentals
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
  // World History
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
  },
  // World Geography
  {
    title: 'World Geography',
    description: 'Test your knowledge of world geography.',
    subject: 'Geography',
    difficulty: 'Easy',
    questions: [
      {
        text: 'Which is the largest continent by area?',
        answers: [
          { text: 'Africa', isCorrect: false },
          { text: 'Asia', isCorrect: true },
          { text: 'Europe', isCorrect: false },
          { text: 'North America', isCorrect: false }
        ],
        explanation: 'Asia is the largest continent by area.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['geography', 'world'],
    isActive: true
  },
  {
    title: 'Civics Fundamentals',
    description: 'Basic questions about civics and government.',
    subject: 'Civics',
    difficulty: 'Medium',
    questions: [
      {
        text: 'What is the supreme law of the land in the United States?',
        answers: [
          { text: 'The Declaration of Independence', isCorrect: false },
          { text: 'The Constitution', isCorrect: true },
          { text: 'The Bill of Rights', isCorrect: false },
          { text: 'The Federalist Papers', isCorrect: false }
        ],
        explanation: 'The Constitution is the supreme law of the land.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['civics', 'government'],
    isActive: true
  },
  {
    title: 'DSA Basics',
    description: 'Test your understanding of Data Structures and Algorithms.',
    subject: 'DSA',
    difficulty: 'Medium',
    questions: [
      {
        text: 'Which data structure uses FIFO (First In First Out) principle?',
        answers: [
          { text: 'Stack', isCorrect: false },
          { text: 'Queue', isCorrect: true },
          { text: 'Tree', isCorrect: false },
          { text: 'Graph', isCorrect: false }
        ],
        explanation: 'Queue uses FIFO principle.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['dsa', 'data structures'],
    isActive: true
  },
  {
    title: 'Web Development Essentials',
    description: 'Questions about the basics of web development.',
    subject: 'Web Development',
    difficulty: 'Easy',
    questions: [
      {
        text: 'Which language is used for styling web pages?',
        answers: [
          { text: 'HTML', isCorrect: false },
          { text: 'CSS', isCorrect: true },
          { text: 'JavaScript', isCorrect: false },
          { text: 'Python', isCorrect: false }
        ],
        explanation: 'CSS is used for styling web pages.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['web', 'development'],
    isActive: true
  },
  // Science
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
      },
      {
        text: 'What is the chemical symbol for water?',
        answers: [
          { text: 'O2', isCorrect: false },
          { text: 'H2O', isCorrect: true },
          { text: 'CO2', isCorrect: false },
          { text: 'NaCl', isCorrect: false }
        ],
        explanation: 'H2O is water.',
        points: 1
      },
      {
        text: 'Which planet is known as the Red Planet?',
        answers: [
          { text: 'Venus', isCorrect: false },
          { text: 'Mars', isCorrect: true },
          { text: 'Jupiter', isCorrect: false },
          { text: 'Saturn', isCorrect: false }
        ],
        explanation: 'Mars is the Red Planet.',
        points: 1
      },
      {
        text: 'What is the boiling point of water at sea level?',
        answers: [
          { text: '100°C', isCorrect: true },
          { text: '0°C', isCorrect: false },
          { text: '50°C', isCorrect: false },
          { text: '212°C', isCorrect: false }
        ],
        explanation: 'Water boils at 100°C at sea level.',
        points: 1
      },
      {
        text: 'Which gas do plants absorb from the atmosphere?',
        answers: [
          { text: 'Oxygen', isCorrect: false },
          { text: 'Carbon Dioxide', isCorrect: true },
          { text: 'Nitrogen', isCorrect: false },
          { text: 'Hydrogen', isCorrect: false }
        ],
        explanation: 'Plants absorb carbon dioxide.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['physics', 'fundamentals'],
    isActive: true
  },
  {
    title: 'Biology Basics',
    description: 'Test your knowledge of basic biology concepts.',
    subject: 'Science',
    difficulty: 'Easy',
    questions: [
      {
        text: 'What is the basic unit of life?',
        answers: [
          { text: 'Atom', isCorrect: false },
          { text: 'Cell', isCorrect: true },
          { text: 'Molecule', isCorrect: false },
          { text: 'Organ', isCorrect: false }
        ],
        explanation: 'The cell is the basic unit of life.',
        points: 1
      },
      {
        text: 'Which organ pumps blood throughout the body?',
        answers: [
          { text: 'Liver', isCorrect: false },
          { text: 'Heart', isCorrect: true },
          { text: 'Lungs', isCorrect: false },
          { text: 'Kidney', isCorrect: false }
        ],
        explanation: 'The heart pumps blood.',
        points: 1
      },
      {
        text: 'What do plants use to make food?',
        answers: [
          { text: 'Photosynthesis', isCorrect: true },
          { text: 'Respiration', isCorrect: false },
          { text: 'Digestion', isCorrect: false },
          { text: 'Transpiration', isCorrect: false }
        ],
        explanation: 'Plants use photosynthesis.',
        points: 1
      },
      {
        text: 'Which vitamin is produced when skin is exposed to sunlight?',
        answers: [
          { text: 'Vitamin A', isCorrect: false },
          { text: 'Vitamin D', isCorrect: true },
          { text: 'Vitamin C', isCorrect: false },
          { text: 'Vitamin B12', isCorrect: false }
        ],
        explanation: 'Vitamin D is produced in sunlight.',
        points: 1
      },
      {
        text: 'Which part of the plant conducts photosynthesis?',
        answers: [
          { text: 'Root', isCorrect: false },
          { text: 'Leaf', isCorrect: true },
          { text: 'Stem', isCorrect: false },
          { text: 'Flower', isCorrect: false }
        ],
        explanation: 'Leaves conduct photosynthesis.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['biology', 'basics'],
    isActive: true
  },
  // History
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
      },
      {
        text: 'Which empire built the Colosseum?',
        answers: [
          { text: 'Greek', isCorrect: false },
          { text: 'Roman', isCorrect: true },
          { text: 'Ottoman', isCorrect: false },
          { text: 'Persian', isCorrect: false }
        ],
        explanation: 'The Romans built the Colosseum.',
        points: 1
      },
      {
        text: 'Who discovered America in 1492?',
        answers: [
          { text: 'Vasco da Gama', isCorrect: false },
          { text: 'Christopher Columbus', isCorrect: true },
          { text: 'Ferdinand Magellan', isCorrect: false },
          { text: 'James Cook', isCorrect: false }
        ],
        explanation: 'Columbus discovered America in 1492.',
        points: 1
      },
      {
        text: 'The Great Wall of China was built to protect against:',
        answers: [
          { text: 'Japanese', isCorrect: false },
          { text: 'Mongols', isCorrect: true },
          { text: 'Indians', isCorrect: false },
          { text: 'Russians', isCorrect: false }
        ],
        explanation: 'The Mongols were the main threat.',
        points: 1
      },
      {
        text: 'Who was the first female Prime Minister of India?',
        answers: [
          { text: 'Sonia Gandhi', isCorrect: false },
          { text: 'Indira Gandhi', isCorrect: true },
          { text: 'Pratibha Patil', isCorrect: false },
          { text: 'Sarojini Naidu', isCorrect: false }
        ],
        explanation: 'Indira Gandhi was the first female PM.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['history', 'world'],
    isActive: true
  },
  {
    title: 'Modern India',
    description: 'Key events and leaders in modern Indian history.',
    subject: 'History',
    difficulty: 'Medium',
    questions: [
      {
        text: 'Who led the Salt March in 1930?',
        answers: [
          { text: 'Jawaharlal Nehru', isCorrect: false },
          { text: 'Mahatma Gandhi', isCorrect: true },
          { text: 'Sardar Patel', isCorrect: false },
          { text: 'Subhas Chandra Bose', isCorrect: false }
        ],
        explanation: 'Gandhi led the Salt March.',
        points: 1
      },
      {
        text: 'When did India gain independence?',
        answers: [
          { text: '1945', isCorrect: false },
          { text: '1947', isCorrect: true },
          { text: '1950', isCorrect: false },
          { text: '1930', isCorrect: false }
        ],
        explanation: 'India became independent in 1947.',
        points: 1
      },
      {
        text: 'Who was the first President of India?',
        answers: [
          { text: 'Rajendra Prasad', isCorrect: true },
          { text: 'Zakir Hussain', isCorrect: false },
          { text: 'Sarvepalli Radhakrishnan', isCorrect: false },
          { text: 'V. V. Giri', isCorrect: false }
        ],
        explanation: 'Dr. Rajendra Prasad was the first President.',
        points: 1
      },
      {
        text: 'Which movement called for Quit India?',
        answers: [
          { text: 'Non-Cooperation', isCorrect: false },
          { text: 'Quit India', isCorrect: true },
          { text: 'Civil Disobedience', isCorrect: false },
          { text: 'Swadeshi', isCorrect: false }
        ],
        explanation: 'The Quit India Movement was in 1942.',
        points: 1
      },
      {
        text: 'Who was the architect of the Indian Constitution?',
        answers: [
          { text: 'B. R. Ambedkar', isCorrect: true },
          { text: 'Jawaharlal Nehru', isCorrect: false },
          { text: 'Sardar Patel', isCorrect: false },
          { text: 'Rajendra Prasad', isCorrect: false }
        ],
        explanation: 'Dr. B. R. Ambedkar was the chief architect.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['history', 'india'],
    isActive: true
  },
  // Civics
  {
    title: 'Civics Fundamentals',
    description: 'Basic questions about civics and government.',
    subject: 'Civics',
    difficulty: 'Medium',
    questions: [
      {
        text: 'What is the supreme law of the land in the United States?',
        answers: [
          { text: 'The Declaration of Independence', isCorrect: false },
          { text: 'The Constitution', isCorrect: true },
          { text: 'The Bill of Rights', isCorrect: false },
          { text: 'The Federalist Papers', isCorrect: false }
        ],
        explanation: 'The Constitution is the supreme law of the land.',
        points: 1
      },
      {
        text: 'Which of the following is an example of horizontal power sharing?',
        answers: [
          { text: 'Power shared between central and state governments', isCorrect: false },
          { text: 'Power shared between different levels of government', isCorrect: false },
          { text: 'Power shared among different organs of government', isCorrect: true },
          { text: 'Power shared among different social groups', isCorrect: false }
        ],
        explanation: 'Horizontal power sharing is among organs of government.',
        points: 1
      },
      {
        text: 'Belgium successfully avoided civil strife by:',
        answers: [
          { text: 'Becoming a dictatorship', isCorrect: false },
          { text: 'Giving special privileges to the Dutch-speaking population', isCorrect: false },
          { text: 'Accommodating the interests of all communities', isCorrect: true },
          { text: 'Forcing French-speaking people to migrate', isCorrect: false }
        ],
        explanation: 'Belgium accommodated all communities.',
        points: 1
      },
      {
        text: 'Which of these is not a feature of federalism?',
        answers: [
          { text: 'There are two or more levels of government', isCorrect: false },
          { text: 'Power is divided between different levels', isCorrect: false },
          { text: 'Each level of government is subordinate to the central government', isCorrect: true },
          { text: 'The Constitution defines the powers of different levels', isCorrect: false }
        ],
        explanation: 'In federalism, no level is subordinate to the centre.',
        points: 1
      },
      {
        text: 'The system of Panchayati Raj involves:',
        answers: [
          { text: 'Two levels of government', isCorrect: false },
          { text: 'Only the state government', isCorrect: false },
          { text: 'The village, block and district level', isCorrect: true },
          { text: 'Urban local bodies only', isCorrect: false }
        ],
        explanation: 'Panchayati Raj is at village, block, district.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['civics', 'government'],
    isActive: true
  },
  {
    title: 'Indian Constitution',
    description: 'Test your knowledge of the Indian Constitution and political system.',
    subject: 'Civics',
    difficulty: 'Medium',
    questions: [
      {
        text: 'Who is known as the Father of the Indian Constitution?',
        answers: [
          { text: 'Jawaharlal Nehru', isCorrect: false },
          { text: 'B. R. Ambedkar', isCorrect: true },
          { text: 'Mahatma Gandhi', isCorrect: false },
          { text: 'Sardar Patel', isCorrect: false }
        ],
        explanation: 'Dr. B. R. Ambedkar is the Father of the Indian Constitution.',
        points: 1
      },
      {
        text: 'Which part of the Constitution deals with Fundamental Rights?',
        answers: [
          { text: 'Part I', isCorrect: false },
          { text: 'Part III', isCorrect: true },
          { text: 'Part IV', isCorrect: false },
          { text: 'Part V', isCorrect: false }
        ],
        explanation: 'Part III deals with Fundamental Rights.',
        points: 1
      },
      {
        text: 'How many schedules are there in the Indian Constitution?',
        answers: [
          { text: '8', isCorrect: false },
          { text: '12', isCorrect: true },
          { text: '10', isCorrect: false },
          { text: '15', isCorrect: false }
        ],
        explanation: 'There are 12 schedules.',
        points: 1
      },
      {
        text: 'Which article deals with the abolition of untouchability?',
        answers: [
          { text: 'Article 15', isCorrect: false },
          { text: 'Article 17', isCorrect: true },
          { text: 'Article 19', isCorrect: false },
          { text: 'Article 21', isCorrect: false }
        ],
        explanation: 'Article 17 abolishes untouchability.',
        points: 1
      },
      {
        text: 'Who appoints the Chief Justice of India?',
        answers: [
          { text: 'Prime Minister', isCorrect: false },
          { text: 'President', isCorrect: true },
          { text: 'Parliament', isCorrect: false },
          { text: 'Supreme Court', isCorrect: false }
        ],
        explanation: 'The President appoints the CJI.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['civics', 'constitution'],
    isActive: true
  },
  // DSA
  {
    title: 'DSA Basics',
    description: 'Test your understanding of Data Structures and Algorithms.',
    subject: 'DSA',
    difficulty: 'Medium',
    questions: [
      {
        text: 'Which data structure uses FIFO (First In First Out) principle?',
        answers: [
          { text: 'Stack', isCorrect: false },
          { text: 'Queue', isCorrect: true },
          { text: 'Tree', isCorrect: false },
          { text: 'Graph', isCorrect: false }
        ],
        explanation: 'Queue uses FIFO principle.',
        points: 1
      },
      {
        text: 'Which data structure uses LIFO (Last In First Out) principle?',
        answers: [
          { text: 'Queue', isCorrect: false },
          { text: 'Stack', isCorrect: true },
          { text: 'Tree', isCorrect: false },
          { text: 'Graph', isCorrect: false }
        ],
        explanation: 'Stack uses LIFO principle.',
        points: 1
      },
      {
        text: 'Which of the following is not a linear data structure?',
        answers: [
          { text: 'Array', isCorrect: false },
          { text: 'Linked List', isCorrect: false },
          { text: 'Tree', isCorrect: true },
          { text: 'Queue', isCorrect: false }
        ],
        explanation: 'Tree is not linear.',
        points: 1
      },
      {
        text: 'Which operation is not possible on a queue?',
        answers: [
          { text: 'Enqueue', isCorrect: false },
          { text: 'Dequeue', isCorrect: false },
          { text: 'Random Access', isCorrect: true },
          { text: 'Peek', isCorrect: false }
        ],
        explanation: 'Random access is not possible in a queue.',
        points: 1
      },
      {
        text: 'Which algorithm is used for sorting?',
        answers: [
          { text: 'Binary Search', isCorrect: false },
          { text: 'Bubble Sort', isCorrect: true },
          { text: 'Depth First Search', isCorrect: false },
          { text: 'Breadth First Search', isCorrect: false }
        ],
        explanation: 'Bubble Sort is a sorting algorithm.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['dsa', 'data structures'],
    isActive: true
  },
  {
    title: 'Algorithms Advanced',
    description: 'Advanced questions on algorithms and their applications.',
    subject: 'DSA',
    difficulty: 'Hard',
    questions: [
      {
        text: 'Which algorithm is used to find the shortest path in a graph?',
        answers: [
          { text: 'Dijkstra', isCorrect: true },
          { text: 'Bubble Sort', isCorrect: false },
          { text: 'Binary Search', isCorrect: false },
          { text: 'DFS', isCorrect: false }
        ],
        explanation: 'Dijkstra is used for shortest path.',
        points: 1
      },
      {
        text: 'Which data structure is used for recursion?',
        answers: [
          { text: 'Queue', isCorrect: false },
          { text: 'Stack', isCorrect: true },
          { text: 'Array', isCorrect: false },
          { text: 'Tree', isCorrect: false }
        ],
        explanation: 'Stack is used for recursion.',
        points: 1
      },
      {
        text: 'Which algorithm is used for searching in a sorted array?',
        answers: [
          { text: 'Linear Search', isCorrect: false },
          { text: 'Binary Search', isCorrect: true },
          { text: 'Bubble Sort', isCorrect: false },
          { text: 'DFS', isCorrect: false }
        ],
        explanation: 'Binary Search is for sorted arrays.',
        points: 1
      },
      {
        text: 'Which of the following is a divide and conquer algorithm?',
        answers: [
          { text: 'Merge Sort', isCorrect: true },
          { text: 'Bubble Sort', isCorrect: false },
          { text: 'Selection Sort', isCorrect: false },
          { text: 'Insertion Sort', isCorrect: false }
        ],
        explanation: 'Merge Sort uses divide and conquer.',
        points: 1
      },
      {
        text: 'Which data structure is used in BFS traversal?',
        answers: [
          { text: 'Stack', isCorrect: false },
          { text: 'Queue', isCorrect: true },
          { text: 'Array', isCorrect: false },
          { text: 'Tree', isCorrect: false }
        ],
        explanation: 'Queue is used in BFS.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['dsa', 'algorithms'],
    isActive: true
  },
  // Web Development
  {
    title: 'Web Development Essentials',
    description: 'Questions about the basics of web development.',
    subject: 'Web Development',
    difficulty: 'Easy',
    questions: [
      {
        text: 'Which language is used for styling web pages?',
        answers: [
          { text: 'HTML', isCorrect: false },
          { text: 'CSS', isCorrect: true },
          { text: 'JavaScript', isCorrect: false },
          { text: 'Python', isCorrect: false }
        ],
        explanation: 'CSS is used for styling web pages.',
        points: 1
      },
      {
        text: 'Which tag is used for inserting an image in HTML?',
        answers: [
          { text: '<img>', isCorrect: true },
          { text: '<image>', isCorrect: false },
          { text: '<src>', isCorrect: false },
          { text: '<pic>', isCorrect: false }
        ],
        explanation: '<img> is used for images.',
        points: 1
      },
      {
        text: 'Which protocol is used for secure communication?',
        answers: [
          { text: 'HTTP', isCorrect: false },
          { text: 'HTTPS', isCorrect: true },
          { text: 'FTP', isCorrect: false },
          { text: 'SMTP', isCorrect: false }
        ],
        explanation: 'HTTPS is secure.',
        points: 1
      },
      {
        text: 'Which of the following is a JavaScript framework?',
        answers: [
          { text: 'React', isCorrect: true },
          { text: 'Django', isCorrect: false },
          { text: 'Laravel', isCorrect: false },
          { text: 'Flask', isCorrect: false }
        ],
        explanation: 'React is a JS framework.',
        points: 1
      },
      {
        text: 'What does CSS stand for?',
        answers: [
          { text: 'Cascading Style Sheets', isCorrect: true },
          { text: 'Computer Style Sheets', isCorrect: false },
          { text: 'Creative Style System', isCorrect: false },
          { text: 'Colorful Style Sheets', isCorrect: false }
        ],
        explanation: 'CSS = Cascading Style Sheets.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['web', 'development'],
    isActive: true
  },
  {
    title: 'Frontend Technologies',
    description: 'Test your knowledge of frontend web technologies.',
    subject: 'Web Development',
    difficulty: 'Medium',
    questions: [
      {
        text: 'Which HTML tag is used for the largest heading?',
        answers: [
          { text: '<h1>', isCorrect: true },
          { text: '<h6>', isCorrect: false },
          { text: '<head>', isCorrect: false },
          { text: '<header>', isCorrect: false }
        ],
        explanation: '<h1> is the largest heading.',
        points: 1
      },
      {
        text: 'Which property is used to change text color in CSS?',
        answers: [
          { text: 'color', isCorrect: true },
          { text: 'background', isCorrect: false },
          { text: 'font-color', isCorrect: false },
          { text: 'text-color', isCorrect: false }
        ],
        explanation: 'color property changes text color.',
        points: 1
      },
      {
        text: 'Which of the following is not a CSS framework?',
        answers: [
          { text: 'Bootstrap', isCorrect: false },
          { text: 'Tailwind', isCorrect: false },
          { text: 'React', isCorrect: true },
          { text: 'Bulma', isCorrect: false }
        ],
        explanation: 'React is a JS library.',
        points: 1
      },
      {
        text: 'Which attribute is used to provide a unique identity to an HTML element?',
        answers: [
          { text: 'id', isCorrect: true },
          { text: 'class', isCorrect: false },
          { text: 'style', isCorrect: false },
          { text: 'name', isCorrect: false }
        ],
        explanation: 'id is used for unique identity.',
        points: 1
      },
      {
        text: 'Which event occurs when the user clicks on an HTML element?',
        answers: [
          { text: 'onchange', isCorrect: false },
          { text: 'onclick', isCorrect: true },
          { text: 'onmouse', isCorrect: false },
          { text: 'onhover', isCorrect: false }
        ],
        explanation: 'onclick is the event.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['web', 'frontend'],
    isActive: true
  },
  // Geography
  {
    title: 'World Geography',
    description: 'Test your knowledge of world geography.',
    subject: 'Geography',
    difficulty: 'Easy',
    questions: [
      {
        text: 'Which is the largest continent by area?',
        answers: [
          { text: 'Africa', isCorrect: false },
          { text: 'Asia', isCorrect: true },
          { text: 'Europe', isCorrect: false },
          { text: 'North America', isCorrect: false }
        ],
        explanation: 'Asia is the largest continent by area.',
        points: 1
      },
      {
        text: 'Which is the longest river in the world?',
        answers: [
          { text: 'Amazon', isCorrect: false },
          { text: 'Nile', isCorrect: true },
          { text: 'Yangtze', isCorrect: false },
          { text: 'Mississippi', isCorrect: false }
        ],
        explanation: 'The Nile is the longest river.',
        points: 1
      },
      {
        text: 'Which country has the largest population?',
        answers: [
          { text: 'USA', isCorrect: false },
          { text: 'China', isCorrect: true },
          { text: 'India', isCorrect: false },
          { text: 'Russia', isCorrect: false }
        ],
        explanation: 'China has the largest population.',
        points: 1
      },
      {
        text: 'Which desert is the largest in the world?',
        answers: [
          { text: 'Sahara', isCorrect: true },
          { text: 'Gobi', isCorrect: false },
          { text: 'Kalahari', isCorrect: false },
          { text: 'Arabian', isCorrect: false }
        ],
        explanation: 'Sahara is the largest desert.',
        points: 1
      },
      {
        text: 'Which ocean is the deepest?',
        answers: [
          { text: 'Atlantic', isCorrect: false },
          { text: 'Pacific', isCorrect: true },
          { text: 'Indian', isCorrect: false },
          { text: 'Arctic', isCorrect: false }
        ],
        explanation: 'Pacific is the deepest ocean.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['geography', 'world'],
    isActive: true
  },
  {
    title: 'Indian Geography',
    description: 'Questions about the geography of India.',
    subject: 'Geography',
    difficulty: 'Medium',
    questions: [
      {
        text: 'Which is the longest river in India?',
        answers: [
          { text: 'Yamuna', isCorrect: false },
          { text: 'Ganga', isCorrect: true },
          { text: 'Godavari', isCorrect: false },
          { text: 'Brahmaputra', isCorrect: false }
        ],
        explanation: 'Ganga is the longest river in India.',
        points: 1
      },
      {
        text: 'Which is the highest mountain peak in India?',
        answers: [
          { text: 'Mount Everest', isCorrect: false },
          { text: 'K2', isCorrect: true },
          { text: 'Kangchenjunga', isCorrect: false },
          { text: 'Nanda Devi', isCorrect: false }
        ],
        explanation: 'K2 is the highest peak in India.',
        points: 1
      },
      {
        text: 'Which state has the longest coastline in India?',
        answers: [
          { text: 'Kerala', isCorrect: false },
          { text: 'Gujarat', isCorrect: true },
          { text: 'Tamil Nadu', isCorrect: false },
          { text: 'Maharashtra', isCorrect: false }
        ],
        explanation: 'Gujarat has the longest coastline.',
        points: 1
      },
      {
        text: 'Which is the largest state in India by area?',
        answers: [
          { text: 'Maharashtra', isCorrect: false },
          { text: 'Rajasthan', isCorrect: true },
          { text: 'Madhya Pradesh', isCorrect: false },
          { text: 'Uttar Pradesh', isCorrect: false }
        ],
        explanation: 'Rajasthan is the largest state by area.',
        points: 1
      },
      {
        text: 'Which is the smallest state in India by area?',
        answers: [
          { text: 'Goa', isCorrect: true },
          { text: 'Sikkim', isCorrect: false },
          { text: 'Tripura', isCorrect: false },
          { text: 'Nagaland', isCorrect: false }
        ],
        explanation: 'Goa is the smallest state by area.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['geography', 'india'],
    isActive: true
  },
  // Literature
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
      },
      {
        text: 'Who wrote "Hamlet"?',
        answers: [
          { text: 'William Shakespeare', isCorrect: true },
          { text: 'Charles Dickens', isCorrect: false },
          { text: 'Jane Austen', isCorrect: false },
          { text: 'Mark Twain', isCorrect: false }
        ],
        explanation: 'Shakespeare wrote Hamlet.',
        points: 1
      },
      {
        text: 'Who is the author of "The Odyssey"?',
        answers: [
          { text: 'Homer', isCorrect: true },
          { text: 'Virgil', isCorrect: false },
          { text: 'Sophocles', isCorrect: false },
          { text: 'Euripides', isCorrect: false }
        ],
        explanation: 'Homer wrote The Odyssey.',
        points: 1
      },
      {
        text: 'Who wrote "To Kill a Mockingbird"?',
        answers: [
          { text: 'Harper Lee', isCorrect: true },
          { text: 'J. D. Salinger', isCorrect: false },
          { text: 'F. Scott Fitzgerald', isCorrect: false },
          { text: 'Ernest Hemingway', isCorrect: false }
        ],
        explanation: 'Harper Lee wrote To Kill a Mockingbird.',
        points: 1
      },
      {
        text: 'Who is the author of "1984"?',
        answers: [
          { text: 'George Orwell', isCorrect: true },
          { text: 'Aldous Huxley', isCorrect: false },
          { text: 'Ray Bradbury', isCorrect: false },
          { text: 'Jules Verne', isCorrect: false }
        ],
        explanation: 'George Orwell wrote 1984.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['literature', 'classics'],
    isActive: true
  },
  {
    title: 'Modern Literature',
    description: 'Questions about modern literature and authors.',
    subject: 'Literature',
    difficulty: 'Medium',
    questions: [
      {
        text: 'Who wrote "The Catcher in the Rye"?',
        answers: [
          { text: 'J. D. Salinger', isCorrect: true },
          { text: 'Harper Lee', isCorrect: false },
          { text: 'George Orwell', isCorrect: false },
          { text: 'F. Scott Fitzgerald', isCorrect: false }
        ],
        explanation: 'J. D. Salinger wrote The Catcher in the Rye.',
        points: 1
      },
      {
        text: 'Who is the author of "The Great Gatsby"?',
        answers: [
          { text: 'F. Scott Fitzgerald', isCorrect: true },
          { text: 'Ernest Hemingway', isCorrect: false },
          { text: 'Mark Twain', isCorrect: false },
          { text: 'Jane Austen', isCorrect: false }
        ],
        explanation: 'F. Scott Fitzgerald wrote The Great Gatsby.',
        points: 1
      },
      {
        text: 'Who wrote "Animal Farm"?',
        answers: [
          { text: 'George Orwell', isCorrect: true },
          { text: 'Aldous Huxley', isCorrect: false },
          { text: 'Ray Bradbury', isCorrect: false },
          { text: 'Jules Verne', isCorrect: false }
        ],
        explanation: 'George Orwell wrote Animal Farm.',
        points: 1
      },
      {
        text: 'Who is the author of "Brave New World"?',
        answers: [
          { text: 'Aldous Huxley', isCorrect: true },
          { text: 'George Orwell', isCorrect: false },
          { text: 'Ray Bradbury', isCorrect: false },
          { text: 'Jules Verne', isCorrect: false }
        ],
        explanation: 'Aldous Huxley wrote Brave New World.',
        points: 1
      },
      {
        text: 'Who wrote "Fahrenheit 451"?',
        answers: [
          { text: 'Ray Bradbury', isCorrect: true },
          { text: 'George Orwell', isCorrect: false },
          { text: 'Aldous Huxley', isCorrect: false },
          { text: 'Jules Verne', isCorrect: false }
        ],
        explanation: 'Ray Bradbury wrote Fahrenheit 451.',
        points: 1
      }
    ],
    timeLimit: 10,
    createdBy: placeholderUserId,
    tags: ['literature', 'modern'],
    isActive: true
  },
  // ... (add Computer Science, General Knowledge, etc. as needed)
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