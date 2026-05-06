"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
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
    <main className="min-h-screen animated-bg grid-pattern">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <DashboardPreview />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
