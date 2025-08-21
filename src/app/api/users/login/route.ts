import { generateJwtUser, verifyPassword } from "@/utils/encrypt";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaErrorHandler } from "@/lib/PrismaErrorHandler";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // 1. Buscar usuario por email
    const user = await prisma.users.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }
    // 2. Verificar contraseña
    const isValidPassword = await verifyPassword(
      body.password,
      user.password_hash!
    );
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }
    // 3. Generar JWT y cookie
    const response = NextResponse.json({ user });
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    response.cookies.set({
      name: "myFinance-User",
      value: generateJwtUser(user.id, user.email || ""),
      httpOnly: true, // protege de acceso desde JS
      secure: process.env.NODE_ENV === "production", // solo HTTPS en producción
      path: "/", // la cookie es accesible desde toda la app
      maxAge: 60 * 60 * 24 * 7, // 7 días
      sameSite: "lax",
    });

    return response;
  } catch (e: unknown) {
    // Manejo específico de Prisma
    return PrismaErrorHandler(e);
  }
}
