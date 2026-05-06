"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { CTASection } from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen animated-bg relative">
      {/* Subtle grid overlay — pointer-events-none so it never blocks clicks */}
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none z-0" />
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <StatsSection />
          <DashboardPreview />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
