import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SALT_ROUNDS = 10; // número de rondas, un equilibrio entre seguridad y tiempo de proceso

// Para crear el hash al registrar un usuario:
async function hashPassword(password: string) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return hash;
}

// Para verificar la contraseña al iniciar sesión:
async function verifyPassword(password: string, hash: string) {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}

function generateJwtUser(userId: number, userEmail: string) {
  return jwt.sign({ id: userId, email: userEmail }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

function deleteJwtUser(response: NextResponse<{ message: string }>) {
  response.cookies.set({
    name: "myFinance-User",
    value: "", // valor vacío
    path: "/", // misma ruta que cuando la creaste
    maxAge: 0, // expira inmediatamente
    httpOnly: true, // protege la cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return response;
}

function getJwtUser(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("myFinance-User="))
    ?.split("=")[1];

  if (!token) {
    return null;
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return user as { id: number; email?: string }; // tipado opcional
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
}
async function getJwtUserFromCookies() {
  const cookieStore = cookies(); // 🔹 NO usar await
  const token = (await cookieStore).get("myFinance-User")?.value; // 🔹 aquí sí podemos usar .get()

  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return user as { id: number; email?: string; name?: string };
  } catch {
    return null;
  }
}


export {
  hashPassword,
  verifyPassword,
  generateJwtUser,
  getJwtUser,
  deleteJwtUser,
  getJwtUserFromCookies,
};
