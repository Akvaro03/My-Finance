import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getJwtUser } from "@/utils/encrypt";
import { PrismaErrorHandler } from "@/lib/PrismaErrorHandler";
import z from "zod";

// Schema de validación con Zod
const createBudgeSchema = z.object({
  category_id: z.number().int().positive(),
  month: z.number().int().min(2000).max(2100), // Año en formato YYYY
  month_num: z.number().int().min(1).max(12),  // Mes en formato numérico (1-12)
  amount: z.number().positive(),
});

// GET → Obtener todas las transacciones del usuario autenticado
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

// POST → Crear una nueva transacción
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = getJwtUser(req);
    if (!user || isNaN(user.id) || user.id <= 0) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    const data = createBudgeSchema.parse(body);

    const budget = await prisma.budgets.create({
      data: {
        user_id: user.id,
        category_id: data.category_id,
        month: data.month,
        month_num: data.month_num,
        amount: data.amount,
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    return PrismaErrorHandler(error);
  }
}
