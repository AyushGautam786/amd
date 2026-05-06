import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { habitLogSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habits = await prisma.habit.findMany({
      where: { userId: session.user.id },
      include: {
        logs: {
          orderBy: { date: "desc" },
          take: 7,
        },
      },
    });

    return NextResponse.json({ success: true, data: habits });
  } catch (error) {
    console.error("Habits GET error:", error);
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
    const validated = habitLogSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const habit = await prisma.habit.findFirst({
      where: { id: validated.data.habitId, userId: session.user.id },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Check if already logged today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId: validated.data.habitId,
        userId: session.user.id,
        date: { gte: today, lt: tomorrow },
      },
    });

    let log;
    if (existingLog) {
      log = await prisma.habitLog.update({
        where: { id: existingLog.id },
        data: { value: validated.data.value, notes: validated.data.notes },
      });
    } else {
      log = await prisma.habitLog.create({
        data: {
          userId: session.user.id,
          habitId: validated.data.habitId,
          value: validated.data.value,
          notes: validated.data.notes,
        },
      });
    }

    // Update streak
    const recentLogs = await prisma.habitLog.findMany({
      where: {
        habitId: validated.data.habitId,
        userId: session.user.id,
        date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { date: "desc" },
    });

    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(checkDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayLog = recentLogs.find(
        (l) => l.date >= checkDate && l.date < nextDate
      );
      if (dayLog && dayLog.value >= habit.target) {
        streak++;
      } else {
        break;
      }
    }

    await prisma.habit.update({
      where: { id: validated.data.habitId },
      data: {
        streak,
        bestStreak: Math.max(habit.bestStreak, streak),
      },
    });

    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    console.error("Habit log POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
