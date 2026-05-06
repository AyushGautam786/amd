"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Brain,
  Target,
  Dumbbell,
  Package,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Meal Recommendations",
    description:
      "Get personalized meal suggestions based on your food inventory, goals, and dietary preferences using Google Gemini AI.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    icon: Target,
    title: "Smart Habit Tracking",
    description:
      "Track water intake, sleep, meal consistency, and workout habits with streak counters and achievement badges.",
    gradient: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-400",
    border: "border-teal-500/20",
  },
  {
    icon: Dumbbell,
    title: "Workout Suggestions",
    description:
      "Receive AI-generated workout plans tailored to your body type, fitness goals, and available time.",
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  {
    icon: Package,
    title: "Food Inventory Intelligence",
    description:
      "Manage your food inventory and let AI create meals from what you already have at home.",
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
    border: "border-green-500/20",
  },
  {
    icon: MessageCircle,
    title: "AI Health Coach",
    description:
      "Chat with your personal AI coach anytime. Ask about meals, workouts, or healthy alternatives.",
    gradient: "from-lime-500/20 to-green-500/20",
    iconColor: "text-lime-400",
    border: "border-lime-500/20",
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description:
      "Visualize your health journey with beautiful charts, streak analytics, and daily health scores.",
    gradient: "from-emerald-500/20 to-lime-500/20",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/20",
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="features" className="py-24 px-4 relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">
            Everything you need
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-5">
            AI-Powered Features for
            <span className="gradient-text"> Healthier Living</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From smart meal planning to habit tracking, NutriHabit AI gives you 
            all the tools to build sustainable healthy habits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card card-hover p-6 border ${feature.border}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 border ${feature.border}`}
                >
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
