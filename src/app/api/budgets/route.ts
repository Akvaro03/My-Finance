import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getJwtUser } from "@/utils/encrypt";
import { PrismaErrorHandler } from "@/lib/PrismaErrorHandler";
import z from "zod";

// Schema de validación con Zod
const createBudgeSchema = z.object({
  category_id: z.number().int().positive(),
  month: z.number().int().min(2000).max(2100), // Año en formato YYYY
  month_num: z.number().int().min(1).max(12), // Mes en formato numérico (1-12)
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
    const thisMonth = new Date().getMonth() + 1; // Mes actual (1-12)
    const thisYear = new Date().getFullYear(); // Año actual
    const budgets = await prisma.budgets.findMany({
      where: {
        user_id: user.id,
        month: thisYear,
        month_num: thisMonth,
      },
      include: {
        categories: true,
      },
      orderBy: { created_at: "desc" },
    });
    const startDate = new Date(thisYear, thisMonth - 1, 1);
    const endDate = new Date(thisYear, thisMonth, 0); // Último
    const expenses = await prisma.transactions.groupBy({
      by: ["category_id"],
      where: {
        category_id: { in: budgets.map((b) => b.category_id) },
        date: { gte: startDate, lte: endDate },
        type: "expense",
      },
      _sum: { amount: true },
    });
    const expensesMap = new Map(
      expenses.map((e) => [e.category_id, e._sum.amount?.toNumber() ?? 0])
    );

    const budgetsWithExpenses = budgets.map((b) => ({
      ...b,
      expense: expensesMap.get(b.category_id) ?? 0,
    }));

    return NextResponse.json(budgetsWithExpenses, { status: 200 });
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
