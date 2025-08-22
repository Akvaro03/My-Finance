import prisma from "@/lib/prisma";
import { PrismaErrorHandler } from "@/lib/PrismaErrorHandler";
import { getJwtUser } from "@/utils/encrypt";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = getJwtUser(req);
  if (!user || isNaN(user.id) || user.id <= 0) {
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });
  }

  try {
    // Traemos todos los Budgets del usuario
    const budgets = await prisma.budgets.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        categories: true,
        users: true,
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(budgets, { status: 200 });
  } catch (error) {
    return PrismaErrorHandler(error);
  }
}
