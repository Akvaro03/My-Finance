import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function PrismaErrorHandler(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    "code" in error &&
    (error as { name?: string; code?: string }).name ===
      "PrismaClientKnownRequestError"
  ) {
    switch (error.code) {
      case "P2002":
        // Error de unique constraint (duplicado)
        return NextResponse.json(
          {
            error: "Ya existe un registro con este valor único",
            issues: error.code,
          },
          { status: 400 }
        );
      case "P2025":
        // No encontrado
        return NextResponse.json(
          { error: "El registro no existe", issues: error.code },
          { status: 400 }
        );
      case "P2003":
        // Error de foreign key constraint
        return NextResponse.json(
          { error: "Violación de clave foránea", issues: error.code },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
    }
  }
  return NextResponse.json(
    { error: error.message || "Internal server error" },
    { status: 500 }
  );
}
