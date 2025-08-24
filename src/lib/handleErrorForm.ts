import z from "zod";

// --- SCHEMAS ---
const transactionSchema = z.object({
    account_id: z.number().int().positive(),
    category_id: z.number().int().positive().optional(),
    type: z.enum(["income", "expense"]),
    amount: z.number().positive(),
    date: z.string().datetime().optional(),
    notes: z.string().optional(),
});

const accountSchema = z.object({
    name: z.string().min(1),
    type: z.enum(["cash", "bank", "credit_card", "wallet"]),
    balance: z.number().nonnegative().optional(),
});
const categorySchema = z.object({
    name: z.string().min(1),
    type: z.enum(["income", "expense"]),
    color: z
        .string()
        .regex(/^#([0-9A-Fa-f]{6})$/)
        .optional(),
    parent_id: z.number().int().positive().optional(),
});
const budgeSchema = z.object({
    category_id: z.number().int().positive(),
    amount: z.number().positive(),
    month: z.number().int().min(2000).max(2100), // Año en formato YYYY
    month_num: z.number().int().min(1).max(12), // Mes en formato numérico (1-12)
});

// --- MAPA DE SCHEMAS ---
const schemas = {
    transaction: transactionSchema,
    account: accountSchema,
    category: categorySchema,
    budge: budgeSchema,
};

// --- MAPA DE ERRORES PERSONALIZADOS ---
const errorMessages = {
    transaction: {
        account_id: "You must select an account",
        category_id: "You must select a category or choose 'None'",
        type: "The transaction type is invalid",
        amount: "The amount must be greater than 0",
        date: "The date format is invalid",
        notes: "Notes must be valid text",
    },
    account: {
        name: "Name bust be valid text",
        type: "The account type is invalid",
    },
    category: {
        name: "Name bust be valid text",
        type: "The category type is invalid",
        color: "The color is invalid",
    },
    budge: {
        category_id: "You must select a category",
        amount: "The amount must be greater than 0",
    },
};

// --- HANDLER REUTILIZABLE ---
function HandleErrorForm<T extends keyof typeof schemas>(
    data: unknown,
    type: T
) {
    console.log(data)
    const schema = schemas[type];
    const parsed = schema.safeParse(data);
    console.log(parsed.success)
    if (parsed.success) return null;
    const issue = parsed.error.issues[0]
    // devolvemos todos los errores encontrados 
    const field = issue.path[0] as keyof typeof errorMessages[T];
    console.log(field)
    const message =
        errorMessages[type][field] || `Error en el campo ${String(field)}`;
    return { field, message };
}

export default HandleErrorForm;
