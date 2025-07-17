import React, { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Loader2, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#10182A] transition-colors duration-300">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 pt-20 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-purple-500" /> Dashboard
        </h1>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
            <span className="ml-4 text-lg text-purple-500">Loading attempts...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16">
            <span className="text-lg text-red-500">{error}</span>
          </div>
        ) : attempts.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No quiz attempts yet.
          </div>
        ) : (
          <div className="space-y-6">
            {attempts.map((a) => (
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