import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z, ZodError } from "zod";
import { getJwtUser } from "@/utils/encrypt";
import { PrismaErrorHandler } from "@/lib/PrismaErrorHandler";

// Schema de validación con Zod
const createTransactionSchema = z.object({
  account_id: z.number().int().positive(),
  category_id: z.number().int().positive().optional(),
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(), // no permito valores 0 o negativos
  date: z.string().datetime().optional(), // ISO date string
  notes: z.string().optional(),
});

// GET → Obtener todas las transacciones del usuario autenticado
export async function GET(req: Request) {
  const user = getJwtUser(req);
  if (!user || isNaN(user.id) || user.id <= 0) {
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });
  }

  try {
    // Solo traemos transacciones de cuentas del usuario
    const transactions = await prisma.transactions.findMany({
      where: {
        accounts: {
          user_id: user.id,
        },
      },
      include: {
        accounts: true,
        categories: true,
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.log(error)
    return PrismaErrorHandler(error);
  }
}

// POST → Crear una nueva transacción
export async function POST(req: Request) {
  const user = getJwtUser(req);
  if (!user || isNaN(user.id) || user.id <= 0) {
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createTransactionSchema.parse(body);

    // Validar que la cuenta realmente pertenezca al usuario autenticado
    const account = await prisma.accounts.findUnique({
      where: { id: data.account_id },
    });

    if (!account || account.user_id !== user.id) {
      return NextResponse.json(
        { error: "Account not found or unauthorized" },
        { status: 403 }
      );
    }
    console.log(data)
    const transaction = await prisma.transactions.create({
      data: {
        account_id: data.account_id,
        category_id: data.category_id ?? null,
        type: data.type,
        amount: data.amount,
        date: data.date ? new Date(data.date) : new Date(),
        notes: data.notes ?? null,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      // Errores de validación → respuesta 400 con detalles
      return NextResponse.json(
        { error: "Validation failed", issues: error },
        { status: 400 }
      );
    }

    return PrismaErrorHandler(error);
  }
}
