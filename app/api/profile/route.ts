import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { onboardingSchema } from "@/lib/validations";
import { calculateDailyCalories } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = onboardingSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;
    const dailyCalorieTarget = calculateDailyCalories(
      data.weight,
      data.height,
      data.age,
      data.gender,
      data.activityLevel
    );

    const profile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        ...data,
        dailyCalorieTarget,
        onboardingComplete: true,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        ...data,
        dailyCalorieTarget,
        onboardingComplete: true,
      },
    });

    // Create default habits for new user
    const existingHabits = await prisma.habit.count({
      where: { userId: session.user.id },
    });

    if (existingHabits === 0) {
      await prisma.habit.createMany({
        data: [
          {
            userId: session.user.id,
            type: "WATER_INTAKE",
            name: "Daily Water Intake",
            target: 8,
            unit: "glasses",
          },
          {
            userId: session.user.id,
            type: "SLEEP",
            name: "Sleep Duration",
            target: 8,
            unit: "hours",
          },
          {
            userId: session.user.id,
            type: "WORKOUT",
            name: "Workout Sessions",
            target: 4,
            unit: "days/week",
          },
          {
            userId: session.user.id,
            type: "MEAL_CONSISTENCY",
            name: "Consistent Meals",
            target: 3,
            unit: "meals/day",
          },
          {
            userId: session.user.id,
            type: "JUNK_FOOD",
            name: "Junk Food Limit",
            target: 2,
            unit: "times/week",
          },
        ],
      });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
