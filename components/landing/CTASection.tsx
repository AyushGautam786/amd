"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-24 px-4" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative glass-card border border-emerald-500/20 p-12 text-center overflow-hidden"
        >
          {/* Background effects */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Start your health journey today
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
              Ready to Transform
              <br />
              <span className="gradient-text">Your Health?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ users who have already transformed their eating habits 
              with AI-powered nutrition intelligence. Free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button size="xl" className="gap-2 glow-emerald group">
                  <Zap className="w-5 h-5" />
                  Start Free Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              No credit card required • Sign in with Google
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
