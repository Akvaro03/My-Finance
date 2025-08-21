"use client";
import BackgroundDecoration from "@/components/BackgroundDecoration";
import FormTransaction from "@/components/forms/FormTransaction";
import Header from "@/components/header";

function NewTransactionPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Background decoration */}
      <BackgroundDecoration />
      <div className="flex flex-1 items-center justify-center">
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
