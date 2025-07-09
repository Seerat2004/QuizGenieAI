import { Brain, ClipboardList, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Smarter quizzes.
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Sharper minds.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Experience the future of learning with AI-powered quiz generation,
            personalized feedback, and intelligent recommendations that adapt to
            your learning style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 px-8 py-4 text-lg font-semibold"
            >
              Start Learning Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8 py-4 text-lg font-semibold"
            >
              Explore Quizzes
            </Button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="hero-card rounded-3xl p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* AI Powered */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                AI Powered
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Advanced algorithms create personalized learning experiences
              </p>
            </div>

            {/* Smart Quizzes */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Smart Quizzes
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Adaptive questions that evolve with your progress
              </p>
            </div>

            {/* Analytics */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detailed insights into your learning patterns
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
