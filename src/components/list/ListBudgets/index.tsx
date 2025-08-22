import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetData from "@/hooks/useGetData";
import { BudgetWithExpense } from "@/types";

function ListBudgets() {
  const { data } = useGetData<BudgetWithExpense[]>("/budgets");
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
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium">
                    {goal.categories.name}
                  </p>
                  <Badge
                    variant="secondary"
                    className="bg-slate-700 text-slate-300"
                  >
                    {Math.round(progress)}%
                  </Badge>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${goal.categories.color} transition-all duration-500`}
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: goal.categories.color || "#3b82f6",
                    }}
                  ></div>
                </div>
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
