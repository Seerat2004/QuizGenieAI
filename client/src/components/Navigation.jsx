import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [showProfile, setShowProfile] = useState(false);
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
            {isLoggedIn && (
              <Link
                to="/history"
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                History
              </Link>
            )}
            {isLoggedIn && user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Admin
              </Link>
            )}

            <ThemeToggle />

            {isLoggedIn ? (
              <div className="relative">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  onClick={() => setShowProfile((v) => !v)}
                  aria-label="Profile"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <UserIcon className="w-6 h-6" />
                  )}
                </button>
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <UserIcon className="w-10 h-10 text-purple-500" />
                      )}
                      <div>
                        <div className="font-bold text-lg text-gray-900 dark:text-white">{user.firstName || user.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-300 font-semibold"
                        onClick={() => { setShowProfile(false); window.location.href = '/dashboard'; }}
                      >
                        View Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 font-semibold"
                        onClick={() => { setShowProfile(false); logout(); }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
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
            {isLoggedIn && (
              <Link
                to="/history"
                className="block py-2 text-gray-700 dark:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                History
              </Link>
            )}
            {isLoggedIn && user?.role === "admin" && (
              <Link
                to="/admin"
                className="block py-2 text-gray-700 dark:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
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
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-full mt-2 flex items-center gap-2" onClick={logout}>
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
