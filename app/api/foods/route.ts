export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { foodItemSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const foods = await prisma.foodItem.findMany({
      where: {
        userId: session.user.id,
        ...(category && category !== "ALL" ? { category: category as never } : {}),
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: foods });
  } catch (error) {
    console.error("Foods GET error:", error);
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
    const validated = foodItemSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const food = await prisma.foodItem.create({
      data: {
        userId: session.user.id,
        ...validated.data,
      },
    });

    return NextResponse.json({ success: true, data: food }, { status: 201 });
  } catch (error) {
    console.error("Foods POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
