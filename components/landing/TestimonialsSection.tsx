"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Fitness Enthusiast",
    content:
      "NutriHabit AI completely changed how I think about food. The AI recommendations are spot-on and actually use what I have at home. Lost 12 pounds in 3 months!",
    rating: 5,
    initials: "SC",
    emoji: "🌟",
  },
  {
    name: "Marcus Johnson",
    role: "Busy Professional",
    content:
      "As someone with zero cooking skills, this app is a lifesaver. The meal suggestions are simple, healthy, and the AI coach keeps me accountable every day.",
    rating: 5,
    initials: "MJ",
    emoji: "💪",
  },
  {
    name: "Priya Patel",
    role: "Vegetarian Lifestyle",
    content:
      "Finally an app that respects my dietary preferences! The vegetarian meal ideas are creative and the habit tracker has helped me drink more water consistently.",
    rating: 5,
    initials: "PP",
    emoji: "🥗",
  },
  {
    name: "David Kim",
    role: "Weight Loss Journey",
    content:
      "The AI health coach feels like talking to a real nutritionist. It understands my schedule and gives practical advice I can actually follow.",
    rating: 5,
    initials: "DK",
    emoji: "🎯",
  },
  {
    name: "Emma Rodriguez",
    role: "Yoga Instructor",
    content:
      "I recommend NutriHabit AI to all my students. The combination of meal tracking and workout suggestions is perfect for holistic wellness.",
    rating: 5,
    initials: "ER",
    emoji: "🧘",
  },
  {
    name: "Alex Thompson",
    role: "Student",
    content:
      "Budget-friendly meal ideas that are actually healthy? Yes! The AI knows I'm a student and suggests affordable, nutritious meals. Game changer!",
    rating: 5,
    initials: "AT",
    emoji: "📚",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="testimonials" className="py-24 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">
            Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-5">
            People Love <span className="gradient-text">NutriHabit AI</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of people who've transformed their health with AI-powered nutrition coaching.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card card-hover p-6"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="text-sm">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                    <span>{testimonial.emoji}</span>
                  </div>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
