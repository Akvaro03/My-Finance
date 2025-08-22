"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  History,
  Target,
  TrendingUp,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Header from "@/components/header";
import BackgroundDecoration from "@/components/BackgroundDecoration";
import useGetData from "@/hooks/useGetData";
import ListTransaction from "@/components/list/ListTransactions";
import ListBudgets from "@/components/list/ListBudgets";
type financeBasics = {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  balanceDiff: number;
};

export default function DashboardPage() {
  const { data } = useGetData<financeBasics>("/financeBasics");
  const { data: budgetData } = useGetData<financeBasics>("/budgets");
  const [showBalance, setShowBalance] = useState(true);
  // Mock user data
  console.log(budgetData);
  const user = {
    balance: data?.balance || 0,
    monthlyIncome: data?.monthlyIncome || 0,
    monthlyExpenses: data?.monthlyExpenses || 0,
  };

  const goals = [
    {
      id: 1,
      title: "Emergency Fund",
      current: 3200,
      target: 10000,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Vacation",
      current: 1800,
      target: 3000,
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "New Car",
      current: 8500,
      target: 25000,
      color: "bg-purple-500",
    },
  ];
  const goToNeWTransactionPage = () => {
    window.location.href = "/transactions/new";
  };
  const goToHistory = () => {
    window.location.href = "/transactions";
  };
  return (
    <div className="min-h-screen">
      <Header />
      {/* Background decoration */}
      <BackgroundDecoration />

      <div className="relative p-6 max-w-7xl mx-auto">
        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600/80 to-sky-500/50 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-2">Current Balance</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-bold">
                    {showBalance
                      ? `$${user.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}`
                      : "••••••"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white hover:bg-white/20"
                  >
                    {showBalance ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-green-200 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+12.5%</span>
                </div>
                <p className="text-blue-100 text-sm">vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={goToNeWTransactionPage}
            className="h-16 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-white justify-start gap-3 transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-left">
              <p className="font-medium">Add Expense</p>
              <p className="text-sm text-slate-400">Track your spending</p>
            </div>
          </Button>

          <Button
            onClick={goToHistory}
            className="h-16 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-white justify-start gap-3 transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-left">
              <p className="font-medium">View History</p>
              <p className="text-sm text-slate-400">See all transactions</p>
            </div>
          </Button>

          <Button className="h-16 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-white justify-start gap-3 transition-all duration-200 hover:scale-[1.02]">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-left">
              <p className="font-medium">Add Goal</p>
              <p className="text-sm text-slate-400">Set savings target</p>
            </div>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income/Expenses Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monthly Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">
                        Monthly Income
                      </p>
                      <p className="text-2xl font-bold text-green-400">
                        $
                        {user.monthlyIncome.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <ArrowUpRight className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">
                        Monthly Expenses
                      </p>
                      <p className="text-2xl font-bold text-red-400">
                        $
                        {user.monthlyExpenses.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <ArrowDownRight className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <ListTransaction title="Some Transactions" />
          </div>

          {/* Goals Section */}
          <ListBudgets />
        </div>
      </div>
    </div>
  );
}
