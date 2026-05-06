import { generateWithRetry, getGeminiModel } from "@/lib/gemini";
import { getMealTime, getGreeting } from "@/lib/utils";

export interface UserContext {
  name?: string;
  age?: number;
  gender?: string;
  bodyType?: string;
  fitnessGoal?: string;
  activityLevel?: string;
  dietaryPreference?: string;
  weight?: number;
  height?: number;
  availableFoods?: string[];
  recentHabits?: {
    waterIntake?: number;
    sleepHours?: number;
    workoutDays?: number;
    junkFoodMeals?: number;
  };
}

export interface MealRecommendationResult {
  title: string;
  description: string;
  meals: {
    name: string;
    ingredients: string[];
    calories: number;
    prepTime: string;
    benefits: string;
  }[];
  totalCalories: number;
  tips: string[];
}

export interface ExerciseRecommendationResult {
  title: string;
  description: string;
  exercises: {
    name: string;
    sets?: number;
    reps?: string;
    duration?: string;
    rest?: string;
    instructions: string;
  }[];
  totalDuration: number;
  difficulty: string;
  warmup: string;
  cooldown: string;
}

export async function generateMealRecommendations(
  userContext: UserContext
): Promise<MealRecommendationResult> {
  const mealTime = getMealTime();
  const foodList =
    userContext.availableFoods && userContext.availableFoods.length > 0
      ? `Available foods in inventory: ${userContext.availableFoods.join(", ")}`
      : "No specific food inventory provided, suggest general healthy options";

  const prompt = `You are NutriHabit AI, a nutrition expert. Generate practical, realistic meal recommendations.

User Profile:
- Name: ${userContext.name || "User"}
- Age: ${userContext.age || 25}
- Gender: ${userContext.gender || "MALE"}
- Body Type: ${userContext.bodyType || "MESOMORPH"}
- Fitness Goal: ${userContext.fitnessGoal || "HEALTHY_LIFESTYLE"}
- Activity Level: ${userContext.activityLevel || "MODERATELY_ACTIVE"}
- Dietary Preference: ${userContext.dietaryPreference || "OMNIVORE"}
- Current Meal Time: ${mealTime}
- ${foodList}

Generate a JSON response with exactly this structure (no markdown, just JSON):
{
  "title": "meal plan title",
  "description": "brief description of the plan",
  "meals": [
    {
      "name": "meal name",
      "ingredients": ["ingredient1", "ingredient2"],
      "calories": 400,
      "prepTime": "15 minutes",
      "benefits": "brief health benefit"
    }
  ],
  "totalCalories": 1200,
  "tips": ["tip1", "tip2", "tip3"]
}

Include 2-3 meals. Keep it practical, beginner-friendly, and aligned with user's goal. Focus on ${mealTime} meals.`;

  try {
    const responseText = await generateWithRetry(prompt);
    const cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleanedText) as MealRecommendationResult;
  } catch {
    return {
      title: "Balanced Meal Plan",
      description: "A healthy and balanced meal plan tailored for you",
      meals: [
        {
          name: "Oatmeal with Fruits",
          ingredients: ["rolled oats", "banana", "berries", "honey"],
          calories: 350,
          prepTime: "10 minutes",
          benefits: "High fiber, sustained energy release",
        },
        {
          name: "Greek Yogurt Parfait",
          ingredients: ["greek yogurt", "granola", "mixed berries"],
          calories: 280,
          prepTime: "5 minutes",
          benefits: "High protein, probiotics for gut health",
        },
      ],
      totalCalories: 630,
      tips: [
        "Drink water before meals",
        "Eat slowly and mindfully",
        "Prepare meals in advance",
      ],
    };
  }
}

export async function generateExerciseRecommendations(
  userContext: UserContext,
  availableTime: number = 30
): Promise<ExerciseRecommendationResult> {
  const prompt = `You are NutriHabit AI, a fitness expert. Generate practical workout recommendations.

User Profile:
- Body Type: ${userContext.bodyType || "MESOMORPH"}
- Fitness Goal: ${userContext.fitnessGoal || "HEALTHY_LIFESTYLE"}
- Activity Level: ${userContext.activityLevel || "MODERATELY_ACTIVE"}
- Available Time: ${availableTime} minutes
- Weight: ${userContext.weight || 70}kg
- Height: ${userContext.height || 170}cm

Generate a JSON response with exactly this structure (no markdown, just JSON):
{
  "title": "workout title",
  "description": "brief workout description",
  "exercises": [
    {
      "name": "exercise name",
      "sets": 3,
      "reps": "12-15",
      "duration": "30 seconds",
      "rest": "60 seconds",
      "instructions": "brief how-to"
    }
  ],
  "totalDuration": 30,
  "difficulty": "Beginner",
  "warmup": "5-minute warmup description",
  "cooldown": "5-minute cooldown description"
}

Include 4-6 exercises. Keep it home-friendly, no equipment required unless specified. Focus on ${userContext.fitnessGoal || "overall health"}.`;

  try {
    const responseText = await generateWithRetry(prompt);
    const cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleanedText) as ExerciseRecommendationResult;
  } catch {
    return {
      title: "Home Fitness Routine",
      description: "A balanced home workout for overall fitness",
      exercises: [
        {
          name: "Jumping Jacks",
          sets: 3,
          reps: "30",
          duration: "1 minute",
          rest: "30 seconds",
          instructions: "Stand with feet together, jump while spreading legs and raising arms overhead",
        },
        {
          name: "Push-ups",
          sets: 3,
          reps: "10-15",
          duration: undefined,
          rest: "60 seconds",
          instructions: "Keep body straight, lower chest to ground, push back up",
        },
        {
          name: "Bodyweight Squats",
          sets: 3,
          reps: "15",
          duration: undefined,
          rest: "60 seconds",
          instructions: "Feet shoulder-width apart, lower until thighs parallel to floor",
        },
      ],
      totalDuration: 30,
      difficulty: "Beginner",
      warmup: "5 minutes of light marching in place and arm circles",
      cooldown: "5 minutes of stretching - quads, hamstrings, and shoulders",
    };
  }
}

export async function generateDailySummary(
  userContext: UserContext
): Promise<{ greeting: string; summary: string; focusAreas: string[]; motivationalTip: string }> {
  const greeting = getGreeting();
  const prompt = `You are NutriHabit AI, a supportive health coach. Generate a personalized daily summary.

User: ${userContext.name || "User"}
Goal: ${userContext.fitnessGoal || "HEALTHY_LIFESTYLE"}
Recent Habits: Water intake ${userContext.recentHabits?.waterIntake || 0} glasses, Sleep ${userContext.recentHabits?.sleepHours || 7} hours, Workouts ${userContext.recentHabits?.workoutDays || 0} days this week

Generate a JSON response (no markdown):
{
  "greeting": "${greeting}, ${userContext.name || "User"}!",
  "summary": "2-3 sentence personalized daily summary and encouragement",
  "focusAreas": ["focus area 1", "focus area 2", "focus area 3"],
  "motivationalTip": "one powerful motivational health tip"
}`;

  try {
    const responseText = await generateWithRetry(prompt);
    const cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleanedText);
  } catch {
    return {
      greeting: `${greeting}, ${userContext.name || "User"}!`,
      summary:
        "Today is a great day to build healthy habits. Focus on staying hydrated, eating balanced meals, and moving your body. Small consistent actions lead to lasting change.",
      focusAreas: ["Stay hydrated", "Eat mindfully", "Move your body"],
      motivationalTip:
        "Progress, not perfection. Every healthy choice you make today compounds over time.",
    };
  }
}

export async function generateHabitInsights(
  userContext: UserContext
): Promise<{ insights: string[]; recommendations: string[]; achievementMessage: string }> {
  const prompt = `You are NutriHabit AI. Analyze user habits and provide insights.

User habits this week:
- Water intake: ${userContext.recentHabits?.waterIntake || 0} glasses/day average
- Sleep: ${userContext.recentHabits?.sleepHours || 0} hours/day average
- Workouts: ${userContext.recentHabits?.workoutDays || 0} days
- Junk food meals: ${userContext.recentHabits?.junkFoodMeals || 0} times

User Goal: ${userContext.fitnessGoal || "HEALTHY_LIFESTYLE"}

Generate JSON (no markdown):
{
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "achievementMessage": "positive achievement acknowledgment"
}`;

  try {
    const responseText = await generateWithRetry(prompt);
    const cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleanedText);
  } catch {
    return {
      insights: [
        "Your hydration levels could be improved",
        "Consistent sleep schedule will boost your energy",
        "Regular movement is key to your goals",
      ],
      recommendations: [
        "Set hourly water reminders",
        "Go to bed 30 minutes earlier",
        "Add a 10-minute walk after meals",
      ],
      achievementMessage:
        "You're taking steps toward a healthier lifestyle. Keep going!",
    };
  }
}

export async function chatWithAICoach(
  message: string,
  userContext: UserContext,
  conversationHistory: { role: string; content: string }[]
): Promise<string> {
  const model = getGeminiModel();
  const systemContext = `You are NutriHabit AI, a friendly and knowledgeable nutrition and fitness coach. 
  
User Profile:
- Name: ${userContext.name || "User"}
- Goal: ${userContext.fitnessGoal || "Healthy Lifestyle"}
- Dietary Preference: ${userContext.dietaryPreference || "Omnivore"}
- Activity Level: ${userContext.activityLevel || "Moderate"}
- Body Type: ${userContext.bodyType || "Mesomorph"}

Guidelines:
- Be conversational, warm, and encouraging
- Give practical, actionable advice
- Keep responses concise (2-4 sentences for simple questions, more for complex ones)
- Focus on sustainable habits, not quick fixes
- Always be positive and supportive
- If asked about medical conditions, recommend consulting a doctor

Respond naturally as a health coach would.`;

  const historyText = conversationHistory
    .slice(-6)
    .map((m) => `${m.role === "user" ? "User" : "NutriHabit AI"}: ${m.content}`)
    .join("\n");

  const fullPrompt = `${systemContext}

${historyText ? `Previous conversation:\n${historyText}\n` : ""}
User: ${message}
NutriHabit AI:`;

  try {
    const responseText = await generateWithRetry(fullPrompt);
    return responseText.trim();
  } catch {
    return "I'm having trouble connecting right now. Please try again in a moment. Remember, every healthy choice you make today is a step in the right direction!";
  }
}
