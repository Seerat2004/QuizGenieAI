import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/Toaster"; // Fixed import path
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home"; // Removed @/ for consistency
import NotFound from "./pages/not-found"; // Removed @/ for consistency
import { SignIn } from "./components/SignIn";
import Quizzes from "./pages/Quizzes";
import { SignUp } from "./components/SignUp";
import QuizAttempt from "./pages/QuizAttempt";
import Result from "./pages/Result";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import History from "./pages/History";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // or a loading spinner
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/quiz-attempt" element={<RequireAuth><QuizAttempt /></RequireAuth>} />
        <Route path="/result" element={<RequireAuth><Result /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;