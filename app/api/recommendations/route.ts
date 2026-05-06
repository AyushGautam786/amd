export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateMealRecommendations,
  generateDailySummary,
  generateHabitInsights,
  type UserContext,
} from "@/services/aiService";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [profile, foodItems, habits, recentLogs] = await Promise.all([
      prisma.userProfile.findUnique({ where: { userId: session.user.id } }),
      prisma.foodItem.findMany({
        where: { userId: session.user.id },
        select: { name: true },
        take: 20,
      }),
      prisma.habit.findMany({ where: { userId: session.user.id } }),
      prisma.habitLog.findMany({
        where: {
          userId: session.user.id,
          date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        include: { habit: true },
      }),
    ]);

    const waterLogs = recentLogs.filter((l) => l.habit.type === "WATER_INTAKE");
    const sleepLogs = recentLogs.filter((l) => l.habit.type === "SLEEP");
    const workoutLogs = recentLogs.filter((l) => l.habit.type === "WORKOUT");
    const junkLogs = recentLogs.filter((l) => l.habit.type === "JUNK_FOOD");

    const userContext: UserContext = {
      name: session.user.name ?? undefined,
      age: profile?.age,
      gender: profile?.gender,
      bodyType: profile?.bodyType,
      fitnessGoal: profile?.fitnessGoal,
      activityLevel: profile?.activityLevel,
      dietaryPreference: profile?.dietaryPreference,
      weight: profile?.weight,
      height: profile?.height,
      availableFoods: foodItems.map((f) => f.name),
      recentHabits: {
        waterIntake:
          waterLogs.length > 0
            ? waterLogs.reduce((a, b) => a + b.value, 0) / waterLogs.length
            : undefined,
        sleepHours:
          sleepLogs.length > 0
            ? sleepLogs.reduce((a, b) => a + b.value, 0) / sleepLogs.length
            : undefined,
        workoutDays: workoutLogs.length,
        junkFoodMeals: junkLogs.length,
      },
    };

    const [mealRec, dailySummary, habitInsights] = await Promise.all([
      generateMealRecommendations(userContext),
      generateDailySummary(userContext),
      generateHabitInsights(userContext),
    ]);

    // Save meal recommendation
    await prisma.mealRecommendation.create({
      data: {
        userId: session.user.id,
        title: mealRec.title,
        description: mealRec.description,
        meals: mealRec.meals as never,
        totalCalories: mealRec.totalCalories,
      },
    });

    return NextResponse.json({
      success: true,
      data: { mealRecommendation: mealRec, dailySummary, habitInsights },
    });
  } catch (error) {
    console.error("Recommendations GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
