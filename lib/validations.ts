import { z } from "zod";

export const onboardingSchema = z.object({
  age: z
    .number()
    .min(13, "Must be at least 13 years old")
    .max(100, "Invalid age"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  height: z.number().min(100, "Height must be at least 100cm").max(250),
  weight: z.number().min(30, "Weight must be at least 30kg").max(300),
  bodyType: z.enum(["ECTOMORPH", "MESOMORPH", "ENDOMORPH"]),
  fitnessGoal: z.enum([
    "FAT_LOSS",
    "MUSCLE_GAIN",
    "HEALTHY_LIFESTYLE",
    "MAINTENANCE",
  ]),
  activityLevel: z.enum([
    "SEDENTARY",
    "LIGHTLY_ACTIVE",
    "MODERATELY_ACTIVE",
    "VERY_ACTIVE",
    "EXTREMELY_ACTIVE",
  ]),
  dietaryPreference: z.enum([
    "OMNIVORE",
    "VEGETARIAN",
    "VEGAN",
    "KETO",
    "PALEO",
    "GLUTEN_FREE",
    "DAIRY_FREE",
  ]),
  sleepTime: z.string().optional(),
  wakeTime: z.string().optional(),
});

export const foodItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.enum([
    "PROTEINS",
    "CARBS",
    "FRUITS",
    "VEGETABLES",
    "DAIRY",
    "SNACKS",
    "BEVERAGES",
    "OTHER",
  ]),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().default("grams"),
  calories: z.number().int().positive().optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const habitLogSchema = z.object({
  habitId: z.string().cuid(),
  value: z.number().min(0),
  notes: z.string().optional(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(1000),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
export type FoodItemData = z.infer<typeof foodItemSchema>;
export type HabitLogData = z.infer<typeof habitLogSchema>;
export type ChatMessageData = z.infer<typeof chatMessageSchema>;
