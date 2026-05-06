export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateExerciseRecommendations,
  type UserContext,
} from "@/services/aiService";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const availableTime = parseInt(searchParams.get("time") || "30");

    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    });

    const userContext: UserContext = {
      name: session.user.name ?? undefined,
      bodyType: profile?.bodyType,
      fitnessGoal: profile?.fitnessGoal,
      activityLevel: profile?.activityLevel,
      weight: profile?.weight,
      height: profile?.height,
    };

    const exerciseRec = await generateExerciseRecommendations(
      userContext,
      availableTime
    );

    // Save to DB
    await prisma.exerciseRecommendation.create({
      data: {
        userId: session.user.id,
        title: exerciseRec.title,
        description: exerciseRec.description,
        exercises: exerciseRec.exercises as never,
        duration: exerciseRec.totalDuration,
        difficulty: exerciseRec.difficulty,
      },
    });

    return NextResponse.json({ success: true, data: exerciseRec });
  } catch (error) {
    console.error("Exercises GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
