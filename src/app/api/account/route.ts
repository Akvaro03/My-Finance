import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getJwtUser } from "@/utils/encrypt";

const createAccountSchema = z.object({
  user_id: z.number().int().positive(),
  name: z.string().min(1),
  type: z.enum(["cash", "bank", "credit_card", "wallet"]),
  balance: z.number().nonnegative().optional(),
});

export async function GET(req: Request) {
  const user = getJwtUser(req);

  if (!user || isNaN(user.id) || user.id <= 0) {
    return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
  }

  const accounts = await prisma.accounts.findMany({
    where: { user_id: user.id },
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
