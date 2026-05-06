"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="blob absolute -top-40 -left-40 w-96 h-96 opacity-20"
          style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)" }}
        />
        <div
          className="blob absolute -bottom-40 -right-40 w-[500px] h-[500px] opacity-15"
          style={{
            background: "radial-gradient(circle, #0d9488 0%, transparent 70%)",
            animationDelay: "-3s",
          }}
        />
        <div
          className="blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10"
          style={{
            background: "radial-gradient(circle, #059669 0%, transparent 70%)",
            animationDelay: "-5s",
          }}
        />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Powered by Google Gemini AI</span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 neon-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6"
        >
          Transform Your
          <br />
          <span className="gradient-text">Eating Habits</span>
          <br />
          with AI Intelligence
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          NutriHabit AI analyzes your lifestyle, food inventory, and habits to deliver 
          personalized meal recommendations, smart workouts, and contextual health coaching.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link href="/auth/signin">
            <Button size="xl" className="gap-2 glow-emerald group">
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="xl" className="gap-2">
              <Brain className="w-5 h-5" />
              See How It Works
            </Button>
          </a>
        </motion.div>

        {/* Floating stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {[
            { label: "Active Users", value: "50K+", icon: "👥" },
            { label: "Meals Recommended", value: "2M+", icon: "🥗" },
            { label: "Habits Tracked", value: "10M+", icon: "🔥" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="glass-card p-4 flex flex-col items-center gap-1 floating"
              style={{ animationDelay: `${i * 2}s` }}
            >
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-2xl font-black gradient-text">{stat.value}</span>
              <span className="text-xs text-gray-500">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
