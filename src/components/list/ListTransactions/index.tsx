import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetData from "@/hooks/useGetData";
import { TransactionWithRelations } from "@/types";
import { ArrowDownRight, ArrowUpRight, Filter, Search } from "lucide-react";

function ListTransaction({
  dataProp,
  limit = 10,
  listNumber,
  title = "All Transactions"
}: {
  dataProp?: TransactionWithRelations[];
  limit?: number;
  listNumber?: number;
  title?:string
}) {
  const { data } = useGetData<TransactionWithRelations[]>("/transactions");
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const TransactionsInfo = dataProp ? dataProp : data;
  const TransactionTotalLength = listNumber
    ? listNumber
    : data
    ? data.length
    : 0;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">{title}</CardTitle>
            <CardDescription className="text-slate-400">
              Showing {limit > TransactionTotalLength ? TransactionTotalLength : limit} of{" "}
              {TransactionTotalLength} transactions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {TransactionsInfo?.slice(0, limit).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    transaction.type === "income"
                      ? "bg-green-500/20"
                      : "bg-red-500/20"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="w-6 h-6 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{transaction.notes}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={`text-xs ${
                        transaction.categories
                          ? transaction.categories.color
                          : "#0000"
                      }`}
                    >
                      {transaction.categories
                        ? transaction.categories.name
                        : ""}
                    </Badge>
                    <span className="text-slate-400 text-sm">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    transaction.type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {Math.abs(Number(transaction.amount)).toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </p>
                <p className="text-slate-400 text-sm">
                  {transaction.accounts.name}
                </p>
              </div>
            </div>
          ))}

          {TransactionsInfo?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-400 text-lg mb-2">
                No transactions found
              </p>
              <p className="text-slate-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ListTransaction;
