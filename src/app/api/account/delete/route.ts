import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getJwtUser } from "@/utils/encrypt";
import { PrismaErrorHandler } from "@/lib/PrismaErrorHandler";

const deleteAccount = z.object({
  delete_id: z.number().int().positive(),
});

export async function POST(req: Request) {
  const user = getJwtUser(req); // Verifica el usuario autenticado

  if (!user || isNaN(user.id) || user.id <= 0) {
    return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
  }
  try {
    const body = await req.json();
    const data = deleteAccount.parse(body);
    await prisma.accounts.delete({
      where: {
        id: data.delete_id,
        user_id: user.id,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return PrismaErrorHandler(error);
  }
}
