import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { CheckCircle, XCircle, BarChart3 } from 'lucide-react';

function getScore(answers, quiz) {
  let correct = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.answer) correct++;
  });
  return correct;
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId, attemptId } = location.state || {};
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!quizId || !attemptId) {
      setLoading(false);
      setError('No result to display');
      return;
    }
    fetch(`/api/quizzes/${quizId}/result/${attemptId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message || 'Failed to fetch result');
        setResult(data.data.performance);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch result');
        setLoading(false);
      });
  }, [quizId, attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#10182A] flex items-center justify-center">
        <Navigation />
        <div className="text-center mt-32">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Loading result...</h2>
        </div>
      </div>
    );
  }
  if (error || !result) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#10182A] flex items-center justify-center">
        <Navigation />
        <div className="text-center mt-32">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error || 'No result to display'}</h2>
          <Button onClick={() => navigate('/quizzes')}>Go to Quizzes</Button>
        </div>
      </div>
    );
  }

  const percent = Math.round((result.score / result.totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#10182A] transition-colors duration-300">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quiz Results</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">Score: {result.score} / {result.totalQuestions}</p>
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative w-32 h-32 mb-2">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="54"
                  className="stroke-current text-gray-200 dark:text-gray-800"
                  strokeWidth="12" fill="none"
                />
                <motion.circle
                  cx="60" cy="60" r="54"
                  className="stroke-current text-purple-500"
                  strokeWidth="12" fill="none"
                  strokeDasharray={339.292}
                  strokeDashoffset={339.292 - (339.292 * percent) / 100}
                  initial={{ strokeDashoffset: 339.292 }}
                  animate={{ strokeDashoffset: 339.292 - (339.292 * percent) / 100 }}
                  transition={{ duration: 1 }}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">{percent}%</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">Score</span>
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {result.score} / {result.totalQuestions} correct
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Question Review</h2>
          <div className="space-y-4">
            {result.questions.map((q, i) => (
              <div key={i} className={`rounded-lg p-4 flex items-center gap-4 ${q.isCorrect ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'}`}>
                {q.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{q.question}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Your answer: <span className={q.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{q.selectedAnswer ?? 'No answer'}</span>
                    {!q.isCorrect && (
                      <>
                        <span className="mx-2">|</span>
                        Correct: <span className="text-green-600 dark:text-green-400">{q.correctAnswer}</span>
                      </>
                    )}
                  </div>
                  {q.explanation && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{q.explanation}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => navigate('/quizzes')} variant="outline">
            Go Home
          </Button>
        </div>
      </main>
    </div>
  );
} 