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

// --- MAPA DE SCHEMAS ---
const schemas = {
    transaction: transactionSchema,
    account: accountSchema,
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
};

// --- HANDLER REUTILIZABLE ---
function HandleErrorForm<T extends keyof typeof schemas>(
    data: unknown,
    type: T
) {
    const schema = schemas[type];
    const parsed = schema.safeParse(data);

    if (parsed.success) return null;
    const issue = parsed.error.issues[0]
    // devolvemos todos los errores encontrados 
    const field = issue.path[0] as keyof typeof errorMessages[T];
    const message =
        errorMessages[type][field] || `Error en el campo ${String(field)}`;
    return { field, message };
}

export default HandleErrorForm;
