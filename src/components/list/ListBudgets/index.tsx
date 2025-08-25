import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetData from "@/hooks/useGetData";
import { BudgetWithExpense } from "@/types";
import { Trash } from "lucide-react";
import { toast } from "sonner";

function ListBudgets() {
  const { data, refetch } = useGetData<BudgetWithExpense[]>("/budgets");
  const handleDelete = async (id: number) => {
    try {
      const data = await fetch("/api/budgets/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ budge_id: id }),
      });
      refetch();
      toast.success("Budget deleted successfully");
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Savings Goals</CardTitle>
        <CardDescription className="text-slate-400">
          Track your progress
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {data?.map((goal) => {
            const progress = (goal.expense / goal.amount) * 100;
            return (
              <div key={goal.id} className="space-y-2">
                {/* Fila superior */}
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium">
                    {goal.categories.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-slate-700 text-slate-300"
                    >
                      {Math.round(progress)}%
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => handleDelete(goal.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: goal.categories.color || "#3b82f6",
                    }}
                  ></div>
                </div>

                {/* Totales */}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    ${goal.expense.toLocaleString("en-US")}
                  </span>
                  <span className="text-slate-400">
                    ${goal.amount.toLocaleString("en-US")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default ListBudgets;
