"use client";
import BackgroundDecoration from "@/components/BackgroundDecoration";
import FormBudgets from "@/components/forms/FormBudgets";
import Header from "@/components/header";

function NewBudgetsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Background decoration */}
      <BackgroundDecoration />
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg">
          <h2 className="text-2xl pb-4 font-bold text-white text-center flex-1">
            New Budgets
          </h2>
          <FormBudgets />
        </div>
      </div>
    </div>
  );
}

export default NewBudgetsPage;