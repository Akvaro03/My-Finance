import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getJwtUser } from "@/utils/encrypt";
import { PrismaErrorHandler } from "@/lib/PrismaErrorHandler";

// Schema de validación
const createCategorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["income", "expense"]),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/)
    .optional(),
  parent_id: z.number().int().positive().optional(),
});

// GET → Listar categorías del usuario
export async function GET(req: Request) {
  const user = getJwtUser(req);
  if (!user || isNaN(user.id) || user.id <= 0) {
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });
  }

  try {
    const categories = await prisma.categories.findMany({
      where: { user_id: user.id },
      include: {
        categories: true, // subcategoría padre
        other_categories: true, // subcategorías hijas
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return PrismaErrorHandler(error);
  }
}

// POST → Crear nueva categoría
export async function POST(req: Request) {
  const user = getJwtUser(req);
  if (!user || isNaN(user.id) || user.id <= 0) {
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log(body)
    const data = createCategorySchema.parse(body);
    // Si viene parent_id, validar que la categoría padre exista y sea del mismo usuario
    if (data.parent_id) {
      const parent = await prisma.categories.findUnique({
        where: { id: data.parent_id },
      });

      if (!parent || parent.user_id !== user.id) {
        return NextResponse.json(
          { error: "Parent category not found or unauthorized" },
          { status: 403 }
        );
      }
    }

    const category = await prisma.categories.create({
      data: {
        name: data.name,
        type: data.type,
        color: data.color ?? "#000000",
        parent_id: data.parent_id ?? null,
        user_id: user.id,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.log(error)
    return PrismaErrorHandler(error);
  }
}
