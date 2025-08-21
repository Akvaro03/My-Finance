"use client";
import FormTransaction from "@/components/forms/FormTransaction";
import Header from "@/components/header";

function NewTransactionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"></div>
      </div>
      <div className="flex items-center justify-center">
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-4 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-white text-center flex-1">
            New Transaction
          </h2>
          <FormTransaction />
        </div>
      </div>
    </div>
  );
}

export default NewTransactionPage;
