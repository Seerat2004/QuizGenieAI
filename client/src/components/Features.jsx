import {
  Lightbulb,
  Zap,
  Settings,
  BarChart3,
  Users,
  Trophy,
} from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "AI-Powered Recommendations",
    description:
      "Our personalized quiz suggestions based on your learning patterns and weak areas.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description:
      "Receive detailed AI-generated feedback immediately after completing each quiz.",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    icon: Settings,
    title: "Adaptive Learning",
    description:
      "Our system adapts to your learning pace and focuses on areas that need improvement.",
    gradient: "from-pink-500 to-purple-500",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Monitor your learning progress with detailed analytics and performance charts.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Community Learning",
    description:
      "Join a community of learners and compete on leaderboards to stay motivated.",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    icon: Trophy,
    title: "Achievements",
    description:
      "Earn badges and certificates as you master different topics and reach milestones.",
    gradient: "from-pink-500 to-purple-500",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Powered by Artificial Intelligence
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our AI analyzes your performance and creates a personalized learning
            journey just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card glass-card rounded-2xl p-8 text-center hover:transform hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
