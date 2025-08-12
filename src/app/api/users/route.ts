import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/utils/encrypt";

export async function GET() {
  const transactions = await prisma.users.findMany();
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password_hash = await hashPassword(body.password);
    const newUser = await prisma.users.create({
      data: {
        name: body.name,
        email: body.email,
        password_hash,
      },
    });
    return NextResponse.json(newUser);
  } catch (e) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
