import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getMealTime(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10) return "breakfast";
  if (hour >= 11 && hour < 14) return "lunch";
  if (hour >= 15 && hour < 17) return "snack";
  if (hour >= 18 && hour < 21) return "dinner";
  return "late-night snack";
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

export function getBMICategory(bmi: number): {
  label: string;
  color: string;
} {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" };
  if (bmi < 25) return { label: "Normal weight", color: "text-emerald-400" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-400" };
  return { label: "Obese", color: "text-red-400" };
}

export function calculateDailyCalories(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string,
  activityLevel: string
): number {
  let bmr: number;
  if (gender === "MALE") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const activityMultipliers: Record<string, number> = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
    EXTREMELY_ACTIVE: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] ?? 1.55;
  return Math.round(bmr * multiplier);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateHealthScore(habits: {
  waterIntake?: number;
  sleepHours?: number;
  workoutDays?: number;
  junkFoodMeals?: number;
}): number {
  let score = 0;
  const maxScore = 100;

  // Water intake (max 25 points)
  if (habits.waterIntake !== undefined) {
    score += Math.min(25, (habits.waterIntake / 8) * 25);
  } else {
    score += 12.5;
  }

  // Sleep (max 25 points)
  if (habits.sleepHours !== undefined) {
    const optimalSleep = Math.max(0, 1 - Math.abs(habits.sleepHours - 7.5) / 3);
    score += optimalSleep * 25;
  } else {
    score += 12.5;
  }

  // Workout (max 30 points)
  if (habits.workoutDays !== undefined) {
    score += Math.min(30, (habits.workoutDays / 4) * 30);
  } else {
    score += 15;
  }

  // Junk food penalty (max 20 points)
  if (habits.junkFoodMeals !== undefined) {
    const junkPenalty = Math.min(20, habits.junkFoodMeals * 5);
    score += Math.max(0, 20 - junkPenalty);
  } else {
    score += 10;
  }

  return Math.min(maxScore, Math.round(score));
}
