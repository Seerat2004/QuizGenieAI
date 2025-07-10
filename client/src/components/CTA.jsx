import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Transform Your Learning?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of learners who are already improving their skills with
          QuizGenie AI.
        </p>
        <Link to="/quizzes">
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Get Started Now
          </Button>
        </Link>
      </div>
    </section>
  );
}
