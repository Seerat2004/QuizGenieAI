import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Input } from "../components/ui/input";
import { Footer } from "../components/Footer";

export default function History() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetch("/api/users/attempts", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message || "Failed to fetch attempts");
        setAttempts(data.data.attempts || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to fetch attempts");
        setLoading(false);
      });
  }, [user]);

  if (!user) return <div className="p-8">Please sign in to view your quiz history.</div>;
  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  // Filter attempts by search
  const filteredAttempts = attempts.filter(attempt =>
    attempt.quizId?.title?.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const totalAttempts = attempts.length;
  const averageScore = totalAttempts > 0 ? (attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts).toFixed(1) : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...attempts.map(a => a.score || 0)) : 0;

  return (
    <>
      <Navigation />
      <div className="max-w-3xl mx-auto p-4 pt-24">
        <h1 className="text-2xl font-bold mb-4">Quiz History</h1>
        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-purple-100 dark:bg-purple-900/40 rounded-lg px-4 py-2 text-purple-800 dark:text-purple-200 font-semibold">
            Total Attempts: {totalAttempts}
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg px-4 py-2 text-blue-800 dark:text-blue-200 font-semibold">
            Average Score: {averageScore}%
          </div>
          <div className="bg-green-100 dark:bg-green-900/40 rounded-lg px-4 py-2 text-green-800 dark:text-green-200 font-semibold">
            Best Score: {bestScore}%
          </div>
        </div>
        {/* Search */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search by quiz title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-xs bg-white dark:bg-[#151f36] border-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 pl-4 py-2 rounded-lg shadow-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        {filteredAttempts.length === 0 ? (
          <div>No quiz attempts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-4 py-2 text-left">Quiz</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Score</th>
                  <th className="px-4 py-2 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttempts.map(attempt => (
                  <tr key={attempt.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2">{attempt.quizId?.title || "(Deleted Quiz)"}</td>
                    <td className="px-4 py-2">{new Date(attempt.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2">{attempt.score != null ? `${attempt.score}%` : "-"}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => navigate(`/result?quizId=${attempt.quizId?._id || attempt.quizId}&attemptId=${attempt._id}`)}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
} 