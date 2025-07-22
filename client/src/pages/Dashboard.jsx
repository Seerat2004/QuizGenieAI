import React, { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Loader2, BarChart3 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rank, setRank] = useState(null);
  const [streak, setStreak] = useState(0);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to compute streak from recentActivity
  function computeStreak(recentActivity) {
    if (!recentActivity || recentActivity.length === 0) return 0;
    let streak = 1;
    let prev = new Date(recentActivity[0].completedAt);
    for (let i = 1; i < recentActivity.length; i++) {
      const curr = new Date(recentActivity[i].completedAt);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diff <= 1.1 && diff >= 0.9) {
        streak++;
        prev = curr;
      } else {
        break;
      }
    }
    return streak;
  }

  const fetchStatsAndLeaderboard = async () => {
    setLoading(true);
    try {
      const [statsRes, lbRes] = await Promise.all([
        fetch("/api/users/stats", { credentials: "include" }),
        fetch("/api/users/leaderboard?limit=100", { credentials: "include" })
      ]);
      const statsData = await statsRes.json();
      const lbData = await lbRes.json();
      if (!statsData.success) throw new Error(statsData.message || "Failed to fetch stats");
      if (!lbData.success) throw new Error(lbData.message || "Failed to fetch leaderboard");
      setStats(statsData.data.stats);
      setLeaderboard(lbData.data.leaderboard);
      // Find user rank
      if (user) {
        const idx = lbData.data.leaderboard.findIndex(u => u.username === user.username);
        setRank(idx >= 0 ? idx + 1 : null);
      }
      // Compute streak
      setStreak(computeStreak(statsData.data.stats.recentActivity));
    } catch (err) {
      setError(err.message || "Failed to fetch stats/leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = () => {
    setLoading(true);
    fetch("/api/users/attempts", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message || "Failed to fetch attempts");
        setAttempts(data.data.attempts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch attempts");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStatsAndLeaderboard();
    fetchAttempts();
    // eslint-disable-next-line
  }, []);

  // Refetch if navigated with refreshDashboard flag
  useEffect(() => {
    if (location.state?.refreshDashboard) {
      fetchStatsAndLeaderboard();
      fetchAttempts();
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Filter attempts by search
  const filteredAttempts = attempts.filter(a => {
    const searchLower = search.toLowerCase();
    return (
      (a.quizId?.title?.toLowerCase().includes(searchLower) || "") ||
      (a.quizId?.subject?.toLowerCase().includes(searchLower) || "") ||
      (a.quizId?.difficulty?.toLowerCase().includes(searchLower) || "")
    );
  });

  return (
    <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#10182A] transition-colors duration-300">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 pt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-purple-500" />
            {user && user.username ? (
              <>Welcome back, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}! <span className="text-2xl">👋</span></>
            ) : (
              <>Dashboard</>
            )}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">Track your quiz progress and stats here.</p>
          <div className="relative max-w-md">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your attempts..."
              className="w-full bg-white dark:bg-[#151f36] border-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 pl-10 py-3 rounded-lg shadow-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </span>
          </div>
        </div>
        {/* Stats, Rank, Streak */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl bg-white dark:bg-[#181f36] shadow p-6 flex flex-col items-center">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">Avg. Score</div>
              <div className="text-2xl font-bold">{stats.averageScore ?? '-'}</div>
            </div>
            <div className="rounded-xl bg-white dark:bg-[#181f36] shadow p-6 flex flex-col items-center">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">Rank</div>
              <div className="text-2xl font-bold">{rank ?? '-'}</div>
            </div>
            <div className="rounded-xl bg-white dark:bg-[#181f36] shadow p-6 flex flex-col items-center">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">Streak</div>
              <div className="text-2xl font-bold">{streak}</div>
            </div>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
            <span className="ml-4 text-lg text-purple-500">Loading attempts...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16">
            <span className="text-lg text-red-500">{error}</span>
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No quiz attempts found.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAttempts.map((a) => (
              <div key={a._id || a.id} className="rounded-xl bg-white dark:bg-[#181f36] shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{a.quizId?.title || "Untitled Quiz"}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{a.quizId?.subject || "Unknown Subject"} &mdash; {a.quizId?.difficulty || ""}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">Attempted: {a.endTime ? new Date(a.endTime).toLocaleString() : "In Progress"}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {a.score != null ? `${a.score} / ${a.totalQuestions}` : "-"}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/result`, { state: { quizId: a.quizId?._id || a.quizId, attemptId: a._id || a.id } })}
                  >
                    View Result
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 