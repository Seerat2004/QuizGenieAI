import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { useLocation, useNavigate } from 'react-router-dom';

export default function QuizAttempt() {
  const location = useLocation();
  const navigate = useNavigate();
  const quiz = location.state?.quiz;

  // Fallback if no quiz is provided
  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#10182A] flex items-center justify-center">
        <Navigation />
        <div className="text-center mt-32">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No quiz selected</h2>
          <Button onClick={() => navigate('/quizzes')}>Go to Quizzes</Button>
        </div>
      </div>
    );
  }

  const { questions, title, topic } = quiz;
  const QUESTION_TIME = 30;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(QUESTION_TIME);

  useEffect(() => {
    setTimer(QUESTION_TIME);
    setSelected(answers[current] ?? null);
    // eslint-disable-next-line
  }, [current]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSelect = (idx) => setSelected(idx);
  const handleNext = () => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[current] = selected;
      return copy;
    });
    setCurrent((c) => c + 1);
  };
  const handlePrev = () => setCurrent((c) => c - 1);
  const handleSubmit = () => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[current] = selected;
      // Navigate to result page with quiz and answers
      navigate('/result', { state: { quiz, answers: copy } });
      return copy;
    });
  };

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const isFirst = current === 0;

  return (
    <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#10182A] transition-colors duration-300">
      <Navigation />
      <main className="max-w-xl mx-auto px-4 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {topic} &mdash; {title}
            </span>
            <span className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
              {timer}s left
            </span>
          </div>
          <Progress value={(timer / QUESTION_TIME) * 100} className="h-2 bg-gray-200 dark:bg-gray-800" />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{q.question}</h2>
            <div className="grid gap-4">
              {q.options.map((opt, idx) => (
                <Button
                  key={idx}
                  variant={selected === idx ? 'default' : 'outline'}
                  className={`w-full text-left px-6 py-4 text-base font-medium rounded-lg border-2 transition-all duration-200
                    ${selected === idx ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 dark:border-pink-500' :
                      'bg-white dark:bg-[#151f36] text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20'}
                  `}
                  onClick={() => handleSelect(idx)}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between gap-4 mt-8">
          <Button
            variant="outline"
            className="px-6 py-2 rounded-lg"
            onClick={handlePrev}
            disabled={isFirst}
          >
            Previous
          </Button>
          {!isLast ? (
            <Button
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              onClick={handleNext}
              disabled={selected === null}
            >
              Next
            </Button>
          ) : (
            <Button
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              onClick={handleSubmit}
              disabled={selected === null}
            >
              Submit
            </Button>
          )}
        </div>
      </main>
    </div>
  );
} 