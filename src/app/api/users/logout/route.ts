import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Creamos la respuesta
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Borramos la cookie estableciendo maxAge: 0
  response.cookies.set({
    name: "myFinance-User",
    value: "",         // valor vacío
    path: "/",         // misma ruta que cuando la creaste
    maxAge: 0,         // expira inmediatamente
    httpOnly: true,    // protege la cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}
