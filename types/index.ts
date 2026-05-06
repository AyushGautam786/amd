import type { User, UserProfile, FoodItem, Habit, HabitLog } from "@prisma/client";

export type { User, UserProfile, FoodItem, Habit, HabitLog };

export interface UserWithProfile extends User {
  profile: UserProfile | null;
}

export interface HabitWithLogs extends Habit {
  logs: HabitLog[];
}

export interface DashboardData {
  user: UserWithProfile;
  habits: HabitWithLogs[];
  foodItems: FoodItem[];
  healthScore: number;
  todayCalories: number;
  waterIntake: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface TestimonialCard {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

export type FoodCategory =
  | "PROTEINS"
  | "CARBS"
  | "FRUITS"
  | "VEGETABLES"
  | "DAIRY"
  | "SNACKS"
  | "BEVERAGES"
  | "OTHER";

export type FitnessGoal =
  | "FAT_LOSS"
  | "MUSCLE_GAIN"
  | "HEALTHY_LIFESTYLE"
  | "MAINTENANCE";

export type ActivityLevel =
  | "SEDENTARY"
  | "LIGHTLY_ACTIVE"
  | "MODERATELY_ACTIVE"
  | "VERY_ACTIVE"
  | "EXTREMELY_ACTIVE";

export type BodyType = "ECTOMORPH" | "MESOMORPH" | "ENDOMORPH";

export type DietaryPreference =
  | "OMNIVORE"
  | "VEGETARIAN"
  | "VEGAN"
  | "KETO"
  | "PALEO"
  | "GLUTEN_FREE"
  | "DAIRY_FREE";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface ProgressData {
  date: string;
  calories: number;
  water: number;
  workout: number;
  sleep: number;
}
