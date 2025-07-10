import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Menu, X, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

// Placeholder for auth state
const isLoggedIn = false; // Replace with real auth logic

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              QuizGenie AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/quizzes"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Quizzes
            </Link>

            <ThemeToggle />

            {!isLoggedIn && (
              <>
                <Link to="/signin" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <Button
                    variant="ghost"
                    className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            {isLoggedIn && (
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-2" onClick={() => {/* logout logic */}}>
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-4 space-y-2 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
            <Link
              to="/"
              className="block py-2 text-gray-700 dark:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/quizzes"
              className="block py-2 text-gray-700 dark:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Quizzes
            </Link>
            <div className="py-2">
              <ThemeToggle />
            </div>
            {!isLoggedIn && (
              <>
                <Link
                  to="/signin"
                  className="block py-2 text-gray-700 dark:text-gray-300 w-full text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="block py-2 text-gray-700 dark:text-gray-300 w-full text-left"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-full mt-2">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            {isLoggedIn && (
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-full mt-2 flex items-center gap-2" onClick={() => {/* logout logic */}}>
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
