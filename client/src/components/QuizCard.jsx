import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Star, HelpCircle, Flame, BookOpen } from 'lucide-react';

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export function QuizCard({
  title = 'Quiz Challenge',
  topic = 'General',
  description = 'Test your knowledge with this quiz!',
  difficulty = 'Medium',
  onStart = () => {},
  icon = <HelpCircle className="w-8 h-8 text-white" />,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(80,0,120,0.15)' }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-gradient-to-br from-[#e0d7fa] to-[#f6c1e7] dark:from-[#2d185a] dark:to-[#1a1a2e] p-6 flex flex-col items-center relative shadow-lg transition-colors duration-300 group"
    >
      <div className="absolute top-4 right-4">
        <Star className="w-6 h-6 text-yellow-400 opacity-70" />
      </div>
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      {/* Topic badge */}
      <div className="flex items-center gap-1 mb-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold">
        <BookOpen className="w-4 h-4" /> {topic}
      </div>
      <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1 text-center">{title}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center">{description}</div>
      <div className={`px-3 py-1 rounded-full text-xs font-semibold mb-4 flex items-center gap-1 ${difficultyColors[difficulty] || difficultyColors['Medium']}`}>
        <Flame className="w-4 h-4" /> {difficulty}
      </div>
      <Button
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg py-2 hover:from-purple-600 hover:to-pink-600"
        onClick={onStart}
      >
        Start Quiz
      </Button>
    </motion.div>
  );
}

export default QuizCard; 