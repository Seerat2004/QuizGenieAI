import React, { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, CheckCircle, TrendingUp, Flame, Trophy, Star, HelpCircle, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QuizCard from '../components/QuizCard';
import { useAuth } from "../contexts/AuthContext";
import { Footer } from '../components/Footer';

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
  const [quizzesBySubject, setQuizzesBySubject] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { label: 'Quizzes Completed', value: 0, icon: <CheckCircle className="w-8 h-8 text-white/70" />, gradient: 'from-purple-500 to-pink-500', text: 'text-white', card: 'bg-gradient-to-tr from-purple-500 to-pink-500 dark:from-gray-900 dark:to-gray-900' },
    { label: 'Average Score', value: '0%', icon: <TrendingUp className="w-8 h-8 text-blue-400" />, gradient: '', text: 'text-gray-900 dark:text-white', card: 'bg-gray-100 dark:bg-[#151f36]' },
    { label: 'Streak', value: '0 days', icon: <Flame className="w-8 h-8 text-orange-400" />, gradient: '', text: 'text-gray-900 dark:text-white', card: 'bg-gray-100 dark:bg-[#151f36]' },
    { label: 'Rank', value: '#-', icon: <Trophy className="w-8 h-8 text-yellow-400" />, gradient: '', text: 'text-gray-900 dark:text-white', card: 'bg-gray-100 dark:bg-[#151f36]' },
  ]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("API Base URL:", import.meta.env.VITE_REACT_APP_API_BASE_URL);
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/quizzes`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch quizzes: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (!data.success) throw new Error('Failed to fetch quizzes');
        // Group quizzes by subject
        const grouped = {};
        data.data.quizzes.forEach(quiz => {
          if (!grouped[quiz.subject]) grouped[quiz.subject] = [];
          grouped[quiz.subject].push(quiz);
        });
        setQuizzesBySubject(grouped);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch quizzes');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user) return;
    // Fetch user stats
    fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/users/stats`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (!data.success) throw new Error('Failed to fetch stats');
        const s = data.data.stats;
        setStats(prev => [
          { ...prev[0], value: s.totalQuizzes },
          { ...prev[1], value: s.averageScore ? `${s.averageScore}%` : '0%' },
          { ...prev[2], value: s.streak ? `${s.streak} days` : '0 days' },
          prev[3], // rank will be set below
        ]);
      })
      .catch(() => {});
    // Fetch leaderboard to get user rank
    fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/users/leaderboard?limit=100`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch leaderboard: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (!data.success) throw new Error('Failed to fetch leaderboard');
        const leaderboard = data.data.leaderboard;
        let rankValue = '#-';
        if (data.data.userRank) {
          rankValue = `#${data.data.userRank}`;
        } else {
          const idx = leaderboard.findIndex(u => u._id === user._id);
          rankValue = idx !== -1 ? `#${idx + 1}` : '#-';
        }
        setStats(prev => prev.map((stat, i) => i === 3 ? { ...stat, value: rankValue } : stat));
      })
      .catch(() => {});
  }, [user]);

  // Handler for starting a quiz
  const handleStartQuiz = async (quiz) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/quizzes/${quiz._id}/start`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to start quiz');
      setModalOpen(false);
      navigate('/quiz-attempt', { state: { quiz: data.data.quiz, attemptId: data.data.attemptId } });
    } catch (err) {
      alert(err.message || 'Failed to start quiz');
    }
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

  // Flatten all quizzes into a single array for searching
  const allQuizzes = Object.values(quizzesBySubject).flat();
  const filteredQuizzes = search.trim() === ""
    ? allQuizzes
    : allQuizzes.filter(q =>
        (q.title && q.title.toLowerCase().includes(search.toLowerCase())) ||
        (q.subject && q.subject.toLowerCase().includes(search.toLowerCase())) ||
        (q.description && q.description.toLowerCase().includes(search.toLowerCase()))
      );

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
            {user && (user.firstName || user.username) ? (
              <>Welcome back, {(user.firstName ? user.firstName : user.username).charAt(0).toUpperCase() + (user.firstName ? user.firstName : user.username).slice(1)}! <span className="text-2xl">👋</span></>
            ) : (
              <>Welcome!</>
            )}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Ready to challenge your mind with some quizzes?</p>
        </motion.div>

        {/* Search and Topics */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="flex-1 w-full">
            <div className="relative">
              <Input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search quizzes..."
                className="w-full bg-white dark:bg-[#151f36] border-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 pl-10 py-3 rounded-lg shadow-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <Button className="bg-white dark:bg-[#151f36] text-purple-600 dark:text-white border-0 px-6 py-3 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-700 transition-colors flex items-center justify-center" aria-label="Search">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Loading/Error State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
            <span className="ml-4 text-lg text-purple-500">Loading quizzes...</span>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center py-16">
            <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
            <span className="text-lg text-red-500">{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && !error && (
          <>
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Available Quizzes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredQuizzes.length === 0 && (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
                  No quizzes found.
                </div>
              )}
              {filteredQuizzes.map((quiz, i) => (
                <motion.div
                  key={quiz._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="rounded-2xl bg-gradient-to-br from-[#e0d7fa] to-[#f6c1e7] dark:from-[#2d185a] dark:to-[#1a1a2e] p-8 flex flex-col items-center relative shadow-lg transition-colors duration-300 cursor-pointer hover:scale-105"
                  onClick={() => handleOpenSubject(quiz.subject)}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                    {subjectIcons[quiz.subject]}
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">{quiz.subject}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 text-center">{quiz.title}</div>
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
                          key={quiz._id}
                          title={quiz.title}
                          topic={selectedSubject}
                          description={quiz.description}
                          difficulty={quiz.difficulty}
                          icon={subjectIcons[selectedSubject]}
                          onStart={() => handleStartQuiz(quiz)}
                        />
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Quizzes; 