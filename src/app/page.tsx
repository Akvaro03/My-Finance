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
import { FloatingComponent } from "@/components/floatingComponent";
import FormTransaction from "@/components/forms/FormTransaction";

export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [showTransaction, setShowTransaction] = useState(false);
  const toggleTransactionForm = () => {
    setShowTransaction(!showTransaction);
  };
  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "demo@myfinance.com",
    avatar: "/placeholder-user.png",
    balance: 12450.75,
    monthlyIncome: 5200.0,
    monthlyExpenses: 3180.25,
  };

  const recentTransactions = [
    {
      id: 1,
      type: "expense",
      description: "Grocery Shopping",
      amount: -85.5,
      date: "Today",
      category: "Food",
    },
    {
      id: 2,
      type: "income",
      description: "Salary Deposit",
      amount: 2600.0,
      date: "Yesterday",
      category: "Salary",
    },
    {
      id: 3,
      type: "expense",
      description: "Netflix Subscription",
      amount: -15.99,
      date: "2 days ago",
      category: "Entertainment",
    },
    {
      id: 4,
      type: "expense",
      description: "Gas Station",
      amount: -45.0,
      date: "3 days ago",
      category: "Transport",
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative p-6 max-w-7xl mx-auto">
        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-sky-500 border-0 text-white">
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
            onClick={toggleTransactionForm}
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

          <Button className="h-16 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-white justify-start gap-3 transition-all duration-200 hover:scale-[1.02]">
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
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Recent Transactions
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your latest financial activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.type === "income"
                              ? "bg-green-500/20"
                              : "bg-red-500/20"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="w-5 h-5 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {transaction.description}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {transaction.date} • {transaction.category}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-bold ${
                          transaction.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : ""}$
                        {Math.abs(transaction.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals Section */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Savings Goals</CardTitle>
                <CardDescription className="text-slate-400">
                  Track your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {goals.map((goal) => {
                    const progress = (goal.current / goal.target) * 100;
                    return (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium">{goal.title}</p>
                          <Badge
                            variant="secondary"
                            className="bg-slate-700 text-slate-300"
                          >
                            {Math.round(progress)}%
                          </Badge>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${goal.color} transition-all duration-500`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">
                            ${goal.current.toLocaleString("en-US")}
                          </span>
                          <span className="text-slate-400">
                            ${goal.target.toLocaleString("en-US")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <FloatingComponent
        title="Nueva Transacción"
        isOpen={showTransaction}
        onClose={toggleTransactionForm}
      >
        <FormTransaction />
      </FloatingComponent>
    </div>
  );
}
