import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const transactions = await prisma.users.findMany();
  return NextResponse.json(transactions);
}
