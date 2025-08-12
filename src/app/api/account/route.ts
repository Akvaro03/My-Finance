import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createAccountSchema = z.object({
  user_id: z.number().int().positive(),
  name: z.string().min(1),
  type: z.enum(["cash", "bank", "credit_card", "wallet"]),
  balance: z.number().nonnegative().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userIdParam = url.searchParams.get("user_id");

  if (!userIdParam) {
    return NextResponse.json(
      { error: "user_id is required as query parameter" },
      { status: 400 }
    );
  }

  const user_id = Number(userIdParam);
  if (isNaN(user_id) || user_id <= 0) {
    return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
  }

  const accounts = await prisma.accounts.findMany({
    where: { user_id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(accounts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createAccountSchema.parse(body);

    const account = await prisma.accounts.create({
      data: {
        user_id: data.user_id,
        name: data.name,
        type: data.type,
        balance: data.balance ?? 0,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", issues: error },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
