"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Droplets,
  Moon,
  Dumbbell,
  TrendingUp,
  BrainCircuit,
  CalendarDays,
  Target,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface DashboardData {
  mealRecommendation: {
    title: string;
    description: string;
    meals: any[];
    tips: string[];
  };
  dailySummary: {
    greeting: string;
    summary: string;
    focusAreas: string[];
    motivationalTip: string;
  };
  habitInsights: {
    insights: string[];
    recommendations: string[];
    achievementMessage: string;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/recommendations");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 skeleton rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 skeleton rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 skeleton rounded-2xl" />
          <div className="h-96 skeleton rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {data?.dailySummary.greeting || `Welcome back, ${session?.user?.name?.split(' ')[0] || 'User'}!`}
          </h1>
          <p className="text-gray-400 max-w-2xl">
            {data?.dailySummary.summary || "Here's your daily health overview."}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/foods">
            <Button variant="outline" className="gap-2 bg-gray-900/50">
              <Target className="w-4 h-4" />
              Log Meal
            </Button>
          </Link>
          <Link href="/chat">
            <Button className="gap-2 glow-emerald">
              <BrainCircuit className="w-4 h-4" />
              Ask AI
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* AI Motivation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="glass-card p-5 border-emerald-500/20 bg-emerald-500/5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-1">AI Daily Insight</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {data?.dailySummary.motivationalTip}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {data?.dailySummary.focusAreas.map((area, i) => (
                <Badge key={i} variant="success" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs py-0">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Flame, label: "Calories", value: "---", unit: "kcal", color: "text-orange-400", bg: "bg-orange-500/10" },
          { icon: Droplets, label: "Water", value: "---", unit: "glasses", color: "text-blue-400", bg: "bg-blue-500/10" },
          { icon: Moon, label: "Sleep", value: "---", unit: "hours", color: "text-purple-400", bg: "bg-purple-500/10" },
          { icon: Dumbbell, label: "Workouts", value: "---", unit: "this week", color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-4 hover:-translate-y-1 transition-transform">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white">{stat.value}</span>
                <span className="text-xs text-gray-600">{stat.unit}</span>
              </div>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area - Left 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Meal Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-emerald-400" />
                  AI Meal Recommendations
                </h2>
                <p className="text-sm text-gray-400 mt-1">{data?.mealRecommendation?.title || "Fetching fresh recommendations..."}</p>
              </div>
              <Badge variant="default" className="flex gap-1 items-center bg-gray-800">
                <Flame className="w-3 h-3 text-orange-400" />
                ~{data?.mealRecommendation?.totalCalories || 0} kcal
              </Badge>
            </div>

            <div className="space-y-4">
              {data?.mealRecommendation?.meals?.map((meal: any, idx: number) => (
                <div key={idx} className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50 hover:border-emerald-500/30 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{meal.name}</h4>
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                      {meal.calories} kcal
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{meal.benefits}</p>
                  <div className="flex flex-wrap gap-2">
                    {meal.ingredients.slice(0, 4).map((ing: string, i: number) => (
                      <span key={i} className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-md">
                        {ing}
                      </span>
                    ))}
                    {meal.ingredients.length > 4 && (
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-md">
                        +{meal.ingredients.length - 4} more
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> Prep time: {meal.prepTime}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Link href="/foods">
                <Button variant="outline" className="w-full text-sm">View Full Inventory</Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Area - Right column */}
        <div className="space-y-6">
          {/* Health Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 text-center relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="text-sm font-medium text-gray-400 mb-4">Daily Health Score</h3>
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" className="stroke-gray-800" strokeWidth="12" fill="none" />
                <circle
                  cx="64" cy="64" r="56"
                  className="stroke-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  strokeWidth="12"
                  strokeDasharray="351.86"
                  strokeDashoffset={351.86 - (351.86 * 85) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white">85</span>
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Good</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">{data?.habitInsights.achievementMessage || "Keep up the great work!"}</p>
          </motion.div>

          {/* AI Insights & Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Smart Recommendations
            </h3>
            <ul className="space-y-3">
              {data?.habitInsights.recommendations?.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="text-gray-300">{rec}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
