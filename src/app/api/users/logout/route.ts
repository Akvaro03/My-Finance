import { deleteJwtUser } from "@/utils/encrypt";
import { NextResponse } from "next/server";

export async function POST() {
  // Creamos la respuesta
  let response = NextResponse.json({ message: "Logged out successfully" });

  // Borramos la cookie estableciendo maxAge: 0
  response = deleteJwtUser(response);

  return response;
}
