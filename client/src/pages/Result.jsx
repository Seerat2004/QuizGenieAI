import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { CheckCircle, XCircle, BarChart3 } from 'lucide-react';

function getQueryParam(search, key) {
  const params = new URLSearchParams(search);
  return params.get(key);
}

function getScore(answers, quiz) {
  let correct = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.answer) correct++;
  });
  return correct;
}

function AnimatedDots() {
  const [dots, setDots] = React.useState('');
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return <span>{dots}</span>;
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  // Try to get quizId and attemptId from location.state, else from query string
  let quizId = location.state?.quizId;
  let attemptId = location.state?.attemptId;
  if (!quizId || !attemptId) {
    quizId = getQueryParam(location.search, 'quizId');
    attemptId = getQueryParam(location.search, 'attemptId');
  }
  const [result, setResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch result and AI feedback
  useEffect(() => {
    let isMounted = true;
    if (!quizId || !attemptId) {
      setLoading(false);
      setError('No result to display');
      return;
    }
    fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/quizzes/${quizId}/result/${attemptId}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch result: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (!data.success) throw new Error(data.message || 'Failed to fetch result');
        if (isMounted) {
          setResult(data.data.performance);
          setAiAnalysis(data.data.aiAnalysis || null);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch result');
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [quizId, attemptId]);

  // Poll for AI feedback if not available
  useEffect(() => {
    if (!result || aiAnalysis) return;
    let isMounted = true;
    const poll = () => {
      fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/quizzes/${quizId}/result/${attemptId}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (!data.success) return;
          if (isMounted && data.data.aiAnalysis) {
            setAiAnalysis(data.data.aiAnalysis);
            clearInterval(interval);
          }
        });
    };
    poll(); // initial poll
    const interval = setInterval(poll, 2000); // poll every 2 seconds
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [result, aiAnalysis, quizId, attemptId]);

  // Manual check for feedback
  const handleManualCheck = () => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/quizzes/${quizId}/result/${attemptId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.aiAnalysis) {
          setAiAnalysis(data.data.aiAnalysis);
        }
      });
  };

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

  const percent = result.score; // result.score is already a percentage
  const isAiLoading = !aiAnalysis || Object.keys(aiAnalysis).length === 0;

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-purple-500" /> Quiz Result
          </h1>
          <div className="text-lg text-gray-600 dark:text-gray-300 mb-2">Score: <span className="font-bold text-purple-600 dark:text-purple-400">{percent}%</span></div>
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
                <span className="text-sm text-gray-600 dark:text-gray-300">Percentage</span>
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {result.correctAnswers} / {result.totalQuestions} correct
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
        <div className="mt-12 bg-white dark:bg-[#181f36] rounded-2xl shadow-2xl p-8 border border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-7 h-7 text-purple-600 dark:text-pink-400 animate-pulse" />
            <h2 className="text-2xl font-extrabold text-purple-700 dark:text-pink-400">AI Feedback & Recommendations</h2>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6 w-full"></div>
          {isAiLoading ? (
            <div className="flex flex-col items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-purple-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <div className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                Generating AI feedback<AnimatedDots />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take up to 30 seconds to appear. Please wait...</div>
              <button
                onClick={handleManualCheck}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold shadow"
              >
                Check Again
              </button>
            </div>
          ) : (
            <>
              {aiAnalysis.overallFeedback && (
                <div className="mb-6 text-lg text-gray-900 dark:text-white font-medium flex items-start gap-2">
                  <span className="inline-block mt-1"><CheckCircle className="w-5 h-5 text-green-500" /></span>
                  <span>{aiAnalysis.overallFeedback}</span>
                </div>
              )}
              {aiAnalysis.detailedFeedback && aiAnalysis.detailedFeedback.length > 0 && (
                <div className="mb-6">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    Detailed Feedback:
                  </div>
                  <ul className="space-y-2 pl-7">
                    {aiAnalysis.detailedFeedback.map((item, i) => (
                      <li key={i} className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3">
                        <div className="font-medium text-gray-900 dark:text-white">{item.question}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{item.feedback}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    Recommendations:
                  </div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 pl-7">
                    {aiAnalysis.recommendations.map((r, i) => (
                      <li key={i} className="leading-relaxed">{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
} 