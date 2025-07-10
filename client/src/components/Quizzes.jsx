import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, CheckCircle, TrendingUp, Flame, Trophy, Star, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QuizCard from './QuizCard';

// Subject icons
const subjectIcons = {
  Mathematics: <HelpCircle className="w-8 h-8 text-white" />,
  History: <Trophy className="w-8 h-8 text-white" />,
  Science: <Flame className="w-8 h-8 text-white" />,
  Literature: <Star className="w-8 h-8 text-white" />,
};

export const Quizzes = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Grouped quizzes by subject
  const quizzesBySubject = {
    Mathematics: [
      {
        title: 'Algebra Basics',
        description: 'Test your skills in algebraic equations and expressions.',
        difficulty: 'Easy',
        icon: subjectIcons.Mathematics,
        questions: [
          {
            question: 'What is the value of x in 2x + 3 = 7?',
            options: ['1', '2', '3', '4'],
            answer: 1,
          },
          {
            question: 'Simplify: 3(x + 2) = ?',
            options: ['3x + 2', '3x + 6', 'x + 5', '6x'],
            answer: 1,
          },
        ],
      },
      {
        title: 'Geometry Fundamentals',
        description: 'Explore the basics of shapes and angles.',
        difficulty: 'Medium',
        icon: subjectIcons.Mathematics,
        questions: [
          {
            question: 'How many degrees are in a triangle?',
            options: ['90', '180', '270', '360'],
            answer: 1,
          },
          {
            question: 'What is the area of a circle with radius r?',
            options: ['2πr', 'πr²', 'πd', 'r²'],
            answer: 1,
          },
        ],
      },
    ],
    History: [
      {
        title: 'World History',
        description: 'Explore important events and figures from world history.',
        difficulty: 'Medium',
        icon: subjectIcons.History,
        questions: [
          {
            question: 'Who was the first President of the United States?',
            options: ['Abraham Lincoln', 'George Washington', 'John Adams', 'Thomas Jefferson'],
            answer: 1,
          },
          {
            question: 'In which year did World War II end?',
            options: ['1942', '1945', '1939', '1950'],
            answer: 1,
          },
        ],
      },
      {
        title: 'Ancient Civilizations',
        description: 'Test your knowledge of ancient cultures and empires.',
        difficulty: 'Hard',
        icon: subjectIcons.History,
        questions: [
          {
            question: 'Which civilization built the pyramids?',
            options: ['Romans', 'Greeks', 'Egyptians', 'Persians'],
            answer: 2,
          },
          {
            question: 'The Great Wall is located in which country?',
            options: ['India', 'China', 'Japan', 'Korea'],
            answer: 1,
          },
        ],
      },
    ],
    Science: [
      {
        title: 'Physics Fundamentals',
        description: 'Challenge yourself with basic physics concepts.',
        difficulty: 'Hard',
        icon: subjectIcons.Science,
        questions: [
          {
            question: 'What is the unit of force?',
            options: ['Joule', 'Newton', 'Watt', 'Pascal'],
            answer: 1,
          },
          {
            question: 'Who formulated the laws of motion?',
            options: ['Einstein', 'Newton', 'Galileo', 'Tesla'],
            answer: 1,
          },
        ],
      },
      {
        title: 'Biology Basics',
        description: 'Learn about living organisms and their functions.',
        difficulty: 'Easy',
        icon: subjectIcons.Science,
        questions: [
          {
            question: 'What is the basic unit of life?',
            options: ['Atom', 'Cell', 'Molecule', 'Organ'],
            answer: 1,
          },
          {
            question: 'Which organ pumps blood?',
            options: ['Liver', 'Heart', 'Lung', 'Brain'],
            answer: 1,
          },
        ],
      },
    ],
    Literature: [
      {
        title: 'Literary Classics',
        description: 'Questions about famous books and authors.',
        difficulty: 'Medium',
        icon: subjectIcons.Literature,
        questions: [
          {
            question: 'Who wrote "Pride and Prejudice"?',
            options: ['Jane Austen', 'Emily Brontë', 'Charles Dickens', 'Mark Twain'],
            answer: 0,
          },
          {
            question: '"To be, or not to be" is a quote from which play?',
            options: ['Macbeth', 'Hamlet', 'Othello', 'King Lear'],
            answer: 1,
          },
        ],
      },
      {
        title: 'Modern Poetry',
        description: 'Explore the world of 20th-century poetry.',
        difficulty: 'Medium',
        icon: subjectIcons.Literature,
        questions: [
          {
            question: 'Who wrote "The Waste Land"?',
            options: ['T.S. Eliot', 'Robert Frost', 'Sylvia Plath', 'W.B. Yeats'],
            answer: 0,
          },
          {
            question: 'Which poet is known for "Leaves of Grass"?',
            options: ['Emily Dickinson', 'Walt Whitman', 'Langston Hughes', 'Carl Sandburg'],
            answer: 1,
          },
        ],
      },
    ],
  };

  // Stats (unchanged)
  const stats = [
    {
      label: 'Quizzes Completed',
      value: 0,
      icon: <CheckCircle className="w-8 h-8 text-white/70" />, // pink gradient
      gradient: 'from-purple-500 to-pink-500',
      text: 'text-white',
      card: 'bg-gradient-to-tr from-purple-500 to-pink-500 dark:from-gray-900 dark:to-gray-900',
    },
    {
      label: 'Average Score',
      value: '0%',
      icon: <TrendingUp className="w-8 h-8 text-blue-400" />, // blue
      gradient: '',
      text: 'text-gray-900 dark:text-white',
      card: 'bg-gray-100 dark:bg-[#151f36]',
    },
    {
      label: 'Streak',
      value: '0 days',
      icon: <Flame className="w-8 h-8 text-orange-400" />, // orange
      gradient: '',
      text: 'text-gray-900 dark:text-white',
      card: 'bg-gray-100 dark:bg-[#151f36]',
    },
    {
      label: 'Rank',
      value: '#3',
      icon: <Trophy className="w-8 h-8 text-yellow-400" />, // yellow
      gradient: '',
      text: 'text-gray-900 dark:text-white',
      card: 'bg-gray-100 dark:bg-[#151f36]',
    },
  ];

  // Handler for starting a quiz
  const handleStartQuiz = (quiz) => {
    setModalOpen(false);
    navigate('/quiz-attempt', { state: { quiz } });
  };

  // Handler for opening subject modal
  const handleOpenSubject = (subject) => {
    setSelectedSubject(subject);
    setModalOpen(true);
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSubject(null);
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#10182A] transition-colors duration-300">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 mt-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            Welcome back, Seerat! <span className="text-2xl">👋</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Ready to challenge your mind with some quizzes?</p>
        </motion.div>

        {/* Search and Topics */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="flex-1 w-full">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search quizzes..."
                className="w-full bg-white dark:bg-[#151f36] border-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 pl-10 py-3 rounded-lg shadow-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <Button className="bg-white dark:bg-[#151f36] text-purple-600 dark:text-white border-0 px-6 py-3 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-700 transition-colors">
            All Topics
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`rounded-xl p-6 flex flex-col justify-between h-32 shadow-lg ${stat.card} ${stat.text} transition-colors duration-300`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">{stat.label}</span>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Available Subjects */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Available Subjects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.keys(quizzesBySubject).map((subject, i) => (
            <motion.div
              key={subject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="rounded-2xl bg-gradient-to-br from-[#e0d7fa] to-[#f6c1e7] dark:from-[#2d185a] dark:to-[#1a1a2e] p-8 flex flex-col items-center relative shadow-lg transition-colors duration-300 cursor-pointer hover:scale-105"
              onClick={() => handleOpenSubject(subject)}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                {subjectIcons[subject]}
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">{subject}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 text-center">{quizzesBySubject[subject].length} quizzes</div>
            </motion.div>
          ))}
        </div>

        {/* Modal for quizzes in selected subject */}
        <AnimatePresence>
          {modalOpen && selectedSubject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#181f36] rounded-2xl shadow-2xl max-w-lg w-full p-8 relative"
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  {selectedSubject} Quizzes
                </h3>
                <div className="grid gap-6">
                  {quizzesBySubject[selectedSubject].map((quiz, idx) => (
                    <QuizCard
                      key={quiz.title}
                      title={quiz.title}
                      topic={selectedSubject}
                      description={quiz.description}
                      difficulty={quiz.difficulty}
                      icon={quiz.icon}
                      onStart={() => handleStartQuiz({ ...quiz, topic: selectedSubject })}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Quizzes;