import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getJwtUser } from "@/utils/encrypt";
import { PrismaErrorHandler } from "@/lib/PrismaErrorHandler";
import z from "zod";

// Schema de validación con Zod
const createBudgeSchema = z.object({
  budge_id: z.number().int().positive(),
});

// POST → Crear una nueva transacción
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = getJwtUser(req);
    if (!user || isNaN(user.id) || user.id <= 0) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    const data = createBudgeSchema.parse(body);

    const budget = await prisma.budgets.delete({
      where: {
        id: data.budge_id,
        user_id: user.id,
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    return PrismaErrorHandler(error);
  }
}
