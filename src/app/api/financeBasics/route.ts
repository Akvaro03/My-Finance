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

    // ✅ Sacamos cuenta (ejemplo: la primera, o podrías pasarla como query param)
    const accounts = await prisma.accounts.findMany({
      where: { user_id: user.id },
    });
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    // 🔹 Balance del mes pasado (calculado por transacciones)
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    let BalanceTotal = 0;
    let incomeTotal = 0;
    let expensesTotal = 0;
    let lastMonthIncomeTotal = 0;
    let lastMonthExpensesTotal = 0;

    await Promise.all(
      accounts.map(async (account) => {
        // 🔹 Ingresos mes actual
        const income = await prisma.transactions.aggregate({
          where: {
            type: "income",
            date: { gte: start, lte: end },
            account_id: account.id,
          },
          _sum: { amount: true },
        });
        // 🔹 Gastos mes actual
        const expenses = await prisma.transactions.aggregate({
          where: {
            type: "expense",
            date: { gte: start, lte: end },
            account_id: account.id,
          },
          _sum: { amount: true },
        });
        const lastMonthIncome = await prisma.transactions.aggregate({
          where: {
            type: "income",
            date: { gte: lastMonthStart, lte: lastMonthEnd },
            account_id: account.id,
          },
          _sum: { amount: true },
        });
        const lastMonthExpenses = await prisma.transactions.aggregate({
          where: {
            type: "expense",
            date: { gte: lastMonthStart, lte: lastMonthEnd },
            account_id: account.id,
          },
          _sum: { amount: true },
        });

        incomeTotal += Number(income._sum.amount ?? 0);
        expensesTotal += Number(expenses._sum.amount ?? 0);
        lastMonthIncomeTotal += Number(lastMonthIncome._sum.amount ?? 0);
        lastMonthExpensesTotal += Number(lastMonthExpenses._sum.amount ?? 0);
        BalanceTotal += account.balance?.toNumber() ?? 0;
      })
    );

    const lastMonthBalance =
      (lastMonthIncomeTotal) -
      (lastMonthExpensesTotal);


    // 🔹 BalanceDiff (comparación con mes pasado)
    const balanceDiff =
      lastMonthBalance > 0
        ? ((Number(BalanceTotal) - Number(lastMonthBalance)) /
            Number(lastMonthBalance)) *
          100
        : null; // null si el mes pasado no hubo balance para evitar división por 0

    return NextResponse.json({
      balance: Number(BalanceTotal),
      monthlyIncome: Number(incomeTotal),
      monthlyExpenses: Number(expensesTotal),
      balanceDiff,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
