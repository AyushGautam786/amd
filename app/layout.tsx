import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "NutriHabit AI - AI-Powered Nutrition & Lifestyle Coach",
    template: "%s | NutriHabit AI",
  },
  description:
    "Transform your eating habits with AI-powered nutrition intelligence. Get personalized meal recommendations, workout suggestions, and habit tracking.",
  keywords: [
    "nutrition",
    "AI",
    "health",
    "meal recommendations",
    "habit tracking",
    "fitness",
    "wellness",
  ],
  openGraph: {
    title: "NutriHabit AI",
    description: "Transform Your Eating Habits with AI-Powered Nutrition Intelligence",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
