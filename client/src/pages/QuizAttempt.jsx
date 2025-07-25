import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { useLocation, useNavigate } from 'react-router-dom';

export default function QuizAttempt() {
  const location = useLocation();
  const navigate = useNavigate();
  let quiz = location.state?.quiz;
  const attemptId = location.state?.attemptId;

  // Defensive: If quiz, quiz.questions, or attemptId is missing, show fallback
  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0 || !attemptId) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#10182A] flex items-center justify-center">
        <Navigation />
        <div className="text-center mt-32">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No quiz selected or quiz has no questions</h2>
          <Button onClick={() => navigate('/quizzes')}>Go to Quizzes</Button>
        </div>
      </div>
    );
  }

  // Map backend quiz format to frontend format if needed
  if (
    quiz.questions.length > 0 &&
    quiz.questions[0] &&
    typeof quiz.questions[0] === 'object' &&
    'text' in quiz.questions[0] &&
    Array.isArray(quiz.questions[0].answers)
  ) {
    quiz = {
      ...quiz,
      questions: quiz.questions.map(q => ({
        question: q.text,
        options: Array.isArray(q.answers) ? q.answers.map(a => a.text) : [],
        correctIndex: Array.isArray(q.answers) ? q.answers.findIndex(a => a.isCorrect) : -1,
        explanation: q.explanation || '',
        _id: q._id
      }))
    };
  }

  const { questions, title, topic } = quiz;
  const QUESTION_TIME = 30;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  // Track answers as array of { questionId, selectedAnswer }
  const [answers, setAnswers] = useState(() => questions.map(() => null));
  const [timer, setTimer] = useState(QUESTION_TIME);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

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
      copy[current] = { questionId: q._id, selectedAnswer: q.options[selected] };
      return copy;
    });
    setCurrent((c) => c + 1);
  };
  const handlePrev = () => setCurrent((c) => c - 1);
  const handleSubmit = async () => {
    // Save the last answer
    const updatedAnswers = [...answers];
    updatedAnswers[current] = { questionId: q._id, selectedAnswer: q.options[selected] };
    console.log('Submitting quiz:', {
      attemptId,
      answers: updatedAnswers.filter(a => a && a.questionId && typeof a.selectedAnswer === 'string' && a.selectedAnswer.length > 0)
    });
    setSubmitting(true);
    setAiLoading(false);
    setAiError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/quizzes/${quiz._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ attemptId, answers: updatedAnswers.filter(a => a && a.questionId && typeof a.selectedAnswer === 'string' && a.selectedAnswer.length > 0) })
      });
      if (!res.ok) throw new Error('Failed to submit quiz: ' + res.status);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to submit quiz');
      // Poll for AI feedback before navigating
      setAiLoading(true);
      let tries = 0;
      const maxTries = 15; // up to 6 seconds (closest to 5s)
      const poll = async () => {
        tries++;
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/quizzes/${quiz._id}/result/${attemptId}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch result: ' + res.status);
        const resultData = await res.json();
        if (resultData.success && resultData.data && resultData.data.aiAnalysis && Object.keys(resultData.data.aiAnalysis).length > 0 && resultData.data.aiAnalysis.overallFeedback && resultData.data.aiAnalysis.detailedFeedback) {
          setAiLoading(false);
          setSubmitting(false);
          navigate('/result', { state: { quizId: quiz._id, attemptId, refreshDashboard: true } });
        } else if (tries < maxTries) {
          setTimeout(poll, 1000);
        } else {
          setAiLoading(false);
          setSubmitting(false);
          setAiError('AI feedback is taking too long. Please check the result page later.');
          navigate('/result', { state: { quizId: quiz._id, attemptId, refreshDashboard: true } });
        }
      };
      poll();
    } catch (err) {
      setSubmitting(false);
      setAiLoading(false);
      alert(err.message || 'Failed to submit quiz');
    }
  };

  const q = questions[current];

  // Defensive: If q or q.options is missing or not an array, show fallback
  if (!q || !Array.isArray(q.options) || q.options.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#10182A] flex items-center justify-center">
        <Navigation />
        <div className="text-center mt-32">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">This quiz has a malformed question or options.</h2>
          <Button onClick={() => navigate('/quizzes')}>Go to Quizzes</Button>
        </div>
      </div>
    );
  }

  if (submitting || aiLoading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#10182A] flex items-center justify-center">
        <Navigation />
        <div className="text-center mt-32">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{aiLoading ? 'Generating AI feedback...' : 'Submitting quiz...'}</h2>
          <div className="text-lg text-gray-600 dark:text-gray-300 mb-2">This may take up to 30 seconds. Please wait...</div>
          {aiError && <div className="text-red-500 mt-2">{aiError}</div>}
        </div>
      </div>
    );
  }

  const isLast = current === questions.length - 1;
  const isFirst = current === 0;

  return (
    <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#10182A] transition-colors duration-300">
      <Navigation />
      <main className="max-w-xl mx-auto px-4 pt-32 pb-16">
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {q.question || q.text || <span className="text-red-500">(No question text provided)</span>}
            </h2>
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