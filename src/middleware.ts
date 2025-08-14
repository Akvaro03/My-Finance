// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("myFinance-User")?.value; // Aquí revisamos si el usuario tiene sesión
  // Si no hay token y quiere acceder a /home (o cualquier ruta privada)
  console.log(token);
  if (!token && !req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (token && req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Configuramos qué rutas va a proteger
export const config = {
  matcher: ["/", "/login"], // aquí pones las rutas privadas
};
