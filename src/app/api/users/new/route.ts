import { hashPassword } from "@/utils/encrypt";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const password_hash = await hashPassword(body.password);

    const newUser = await prisma.users.create({
      data: {
        name: body.name?.trim() || "New User",
        email: body.email,
        password_hash,
      },
    });

    const response = NextResponse.json({ user: newUser });
    response.cookies.set({
      name: "myFinance-User",
      value: "500",
      httpOnly: true, // protege de acceso desde JS
      secure: process.env.NODE_ENV === "production", // solo HTTPS en producción
      path: "/", // la cookie es accesible desde toda la app
      maxAge: 60 * 60 * 24 * 7, // 7 días
      sameSite: "lax",
    });

    return response;
  } catch (e: any) {
    // Manejo específico de Prisma
    if (e?.name === "PrismaClientKnownRequestError" && e.code === "P2002") {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
