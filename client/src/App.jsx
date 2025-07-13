import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/Toaster"; // Fixed import path
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home"; // Removed @/ for consistency
import NotFound from "./pages/not-found"; // Removed @/ for consistency
import { SignIn } from "./components/SignIn";
import {Quizzes} from "./components/Quizzes";
import { SignUp } from "./components/SignUp";
import QuizAttempt from "./pages/QuizAttempt";
import Result from "./pages/Result";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/quiz-attempt" element={<QuizAttempt />} />
        <Route path="/result" element={<Result />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;