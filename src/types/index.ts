type TransactionWithRelations = {
  id: number;
  account_id: number;
  category_id: number | null;
  type: "income" | "expense";
  amount: string; // Prisma.Decimal serializado como string
  date: string; // ISO string
  notes: string | null;
  created_at: string;
  updated_at: string;
  accounts: {
    id: number;
    name: string;
    type: string;
    balance: string;
    user_id: number;
  };
  categories: {
    id: number;
    name: string;
    type: string;
    color: string;
    parent_id: number | null;
    user_id: number;
  } | null;
};

export type { TransactionWithRelations };
