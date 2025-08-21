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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Header from "@/components/header";
import useGetData from "@/hooks/useGetAccounts";
import { TransactionWithRelations } from "@/types";
import { categories } from "@/generated/prisma";
import ListTransaction from "@/components/ListTransactions";
import BackgroundDecoration from "@/components/BackgroundDecoration";

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const { data } = useGetData<TransactionWithRelations>("/transactions");
  const { data: categoriesData } = useGetData<categories>("/categories");

  // Mock transaction data
  const allTransactions = data || []; // Use fetched data or fallback to empty array

  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch = transaction.notes
      ? transaction.notes.toLowerCase().includes(searchTerm.toLowerCase())
      : false;

    const matchesCategory =
      selectedCategory === "all" ||
      (transaction.categories &&
        transaction.categories.name.toLowerCase() === selectedCategory);

    const matchesType =
      selectedType === "all" || transaction.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Calculate statistics
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const netAmount = totalIncome - totalExpenses;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <BackgroundDecoration />

      <div className="relative p-6 max-w-7xl mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Income</p>
                  <p className="text-2xl font-bold text-green-400">
                    $
                    {totalIncome.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-400">
                    $
                    {totalExpenses.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Net Amount</p>
                  <p
                    className={`text-2xl font-bold ${
                      netAmount >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {netAmount >= 0 ? "+" : ""}$
                    {netAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    netAmount >= 0 ? "bg-green-500/20" : "bg-red-500/20"
                  }`}
                >
                  <DollarSign
                    className={`w-6 h-6 ${
                      netAmount >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border border-slate-600 text-white">
                  <SelectItem
                    className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                    value="all"
                  >
                    All Types
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                    value="income"
                  >
                    Income
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                    value="expense"
                  >
                    Expenses
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border border-slate-600 text-white">
                  <SelectItem
                    className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                    value="all"
                  >
                    All Categories
                  </SelectItem>
                  {categoriesData &&
                    categoriesData.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.name.toLowerCase()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border border-slate-600 text-white">
                  <SelectItem
                    className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                    value="all"
                  >
                    All Time
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                    value="today"
                  >
                    Today
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                    value="week"
                  >
                    This Week
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                    value="month"
                  >
                    This Month
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                    value="year"
                  >
                    This Year
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <ListTransaction
          dataProp={filteredTransactions}
          listNumber={allTransactions.length}
          title="All Transactions"
        />
      </div>
    </div>
  );
}
