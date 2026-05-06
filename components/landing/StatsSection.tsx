"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stats = [
  { value: 50000, suffix: "+", label: "Active Users", prefix: "" },
  { value: 2, suffix: "M+", label: "Meals Recommended", prefix: "" },
  { value: 95, suffix: "%", label: "Satisfaction Rate", prefix: "" },
  { value: 10, suffix: "M+", label: "Habits Tracked", prefix: "" },
];

function AnimatedCounter({
  target,
  suffix,
  prefix,
  isInView,
}: {
  target: number;
  suffix: string;
  prefix: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span className="text-4xl md:text-5xl font-black gradient-text">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="stats" className="py-24 px-4 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Real results from real people transforming their health habits
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 text-center border border-emerald-500/15"
            >
              <AnimatedCounter
                target={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                isInView={isInView}
              />
              <p className="text-gray-400 text-sm mt-2 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
