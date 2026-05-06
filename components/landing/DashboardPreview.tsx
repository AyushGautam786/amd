"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Droplets, Flame, Moon, Dumbbell, TrendingUp } from "lucide-react";

export function DashboardPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-24 px-4 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Your <span className="gradient-text">Smart Dashboard</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A premium dashboard that gives you a complete picture of your health at a glance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-3xl border border-emerald-500/15 p-6 md:p-8 shadow-2xl shadow-emerald-500/5"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gray-400 text-sm">Good morning 👋</p>
              <h3 className="text-2xl font-bold text-white">Dashboard Overview</h3>
            </div>
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 neon-pulse" />
              <span className="text-xs text-emerald-400 font-medium">AI Active</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Flame, label: "Calories", value: "1,840", unit: "/ 2,100 kcal", color: "text-orange-400", bg: "bg-orange-500/10", progress: 87 },
              { icon: Droplets, label: "Water", value: "6", unit: "/ 8 glasses", color: "text-blue-400", bg: "bg-blue-500/10", progress: 75 },
              { icon: Moon, label: "Sleep", value: "7.5", unit: "/ 8 hours", color: "text-purple-400", bg: "bg-purple-500/10", progress: 93 },
              { icon: Dumbbell, label: "Workouts", value: "3", unit: "/ 4 days", color: "text-emerald-400", bg: "bg-emerald-500/10", progress: 75 },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-gray-900/60 rounded-2xl p-4 border border-gray-800/50"
                >
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.unit}</p>
                  <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500`}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${stat.progress}%` } : {}}
                      transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* AI Insight */}
          <div className="glass-card p-5 border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-400 mb-1">AI Daily Insight</p>
                <p className="text-sm text-gray-300">
                  Great progress today! You&apos;re 87% on track with your calorie goal. 
                  Consider a light snack with protein before your evening workout. 
                  Your 7-day streak for water intake is impressive! 🔥
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
