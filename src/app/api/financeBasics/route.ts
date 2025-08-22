import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { getJwtUser } from "@/utils/encrypt";

/**
 * Ruta para obtener los datos básicos de finanzas del mes actual.
 * Incluye ingresos, gastos, balance del mes pasado y balance actual.
 */
export async function GET(req: Request) {
  try {
    const user = getJwtUser(req);
    if (!user || isNaN(user.id) || user.id <= 0) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // ✅ Ingresos y gastos del mes actual
    const income = await prisma.transactions.aggregate({
      where: {
        type: "income",
        date: { gte: start, lte: end },
        accounts: { user_id: user.id }, // 🔑 join con accounts -> filtra por usuario
      },
      _sum: { amount: true },
    });

    const expenses = await prisma.transactions.aggregate({
      where: {
        type: "expense",
        date: { gte: start, lte: end },
        accounts: { user_id: user.id },
      },
      _sum: { amount: true },
    });

    // ✅ Ingresos y gastos del mes pasado
    const lastMonthIncome = await prisma.transactions.aggregate({
      where: {
        type: "income",
        date: { gte: lastMonthStart, lte: lastMonthEnd },
        accounts: { user_id: user.id },
      },
      _sum: { amount: true },
    });

    const lastMonthExpenses = await prisma.transactions.aggregate({
      where: {
        type: "expense",
        date: { gte: lastMonthStart, lte: lastMonthEnd },
        accounts: { user_id: user.id },
      },
      _sum: { amount: true },
    });

    // ✅ Balance total basado en todas las transacciones
    const totalIncome = Number(income._sum.amount ?? 0);
    const totalExpenses = Number(expenses._sum.amount ?? 0);
    const BalanceTotal = totalIncome - totalExpenses;

    const lastMonthIncomeTotal = Number(lastMonthIncome._sum.amount ?? 0);
    const lastMonthExpensesTotal = Number(lastMonthExpenses._sum.amount ?? 0);
    const lastMonthBalance = lastMonthIncomeTotal - lastMonthExpensesTotal;

    // ✅ BalanceDiff
    const balanceDiff =
      lastMonthBalance > 0
        ? ((BalanceTotal - lastMonthBalance) / lastMonthBalance) * 100
        : null;

    return NextResponse.json({
      balance: BalanceTotal,
      monthlyIncome: totalIncome,
      monthlyExpenses: totalExpenses,
      balanceDiff,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
