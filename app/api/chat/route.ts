export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatMessageSchema } from "@/lib/validations";
import { chatWithAICoach, type UserContext } from "@/services/aiService";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("Chat GET error:", error);
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
    const validated = chatMessageSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const [profile, history] = await Promise.all([
      prisma.userProfile.findUnique({ where: { userId: session.user.id } }),
      prisma.chatMessage.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const userContext: UserContext = {
      name: session.user.name ?? undefined,
      fitnessGoal: profile?.fitnessGoal,
      dietaryPreference: profile?.dietaryPreference,
      activityLevel: profile?.activityLevel,
      bodyType: profile?.bodyType,
    };

    const conversationHistory = history
      .reverse()
      .map((m) => ({ role: m.role, content: m.content }));

    // Save user message
    await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        role: "user",
        content: validated.data.message,
      },
    });

    const aiResponse = await chatWithAICoach(
      validated.data.message,
      userContext,
      conversationHistory
    );

    // Save AI response
    const savedResponse = await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        role: "assistant",
        content: aiResponse,
      },
    });

    return NextResponse.json({ success: true, data: savedResponse });
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
