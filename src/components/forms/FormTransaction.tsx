import { useState } from "react";
import useGetAccount from "@/hooks/useGetAccounts";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FloatingComponent } from "../floatingComponent";
import FormAccount from "./FormAccount";
// 👉 crearías algo similar para categorías
const transactionTypes = [
  { value: 1, label: "Income" },
  { value: 2, label: "Expense" },
];

function FormTransaction() {
  const [formData, setFormData] = useState({
    amount: "",
    typeId: "",
    notes: "",
    categoryId: "",
    accountId: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddAccount, setShowAddAccount] = useState(false);

  const { accounts, isLoadingAccounts } = useGetAccount();

  const handleSubmit = () => {
    try {
      setIsLoading(true);
      setError(null);
    } catch (error: unknown) {
      setError("An error occurred while creating the transaction.");
    }
  };
  const handleFormDataChange = (
    value: string,
    type: "amount" | "typeId" | "notes" | "accountId"
  ) => {
    setFormData((prev) => ({ ...prev, [type]: value }));
  };
  return (
    <Card className="login-card shadow-2xl">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Accounts Field */}
          <div className="space-y-2">
            <Label htmlFor="account" className="text-slate-300 font-medium">
              Accounts
            </Label>
            <div className="flex gap-2 items-center">
              <Select
                value={formData.accountId}
                onValueChange={(value) =>
                  handleFormDataChange(value, "accountId")
                }
              >
                <SelectTrigger className="flex-1 bg-slate-800/50 border-slate-600 text-white">
                  <SelectValue
                    placeholder={
                      isLoadingAccounts ? "Loading..." : "Select account"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {accounts && accounts[0] ? (
                    accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id.toString()}>
                        {acc.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="2" disabled>
                      No accounts available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowAddAccount(true)}
                className="border-slate-600 hover:bg-slate-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Categories Field */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-300 font-medium">
              Categories
            </Label>
            <div className="flex gap-2 items-center">
              <Select
                onValueChange={(value) => handleFormDataChange(value, "typeId")}
                value={formData.typeId}
              >
                <SelectTrigger className="flex-1 bg-slate-800/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount Field */}
          <div className="space-y-2">
            <Label htmlFor="value" className="text-slate-300 font-medium">
              Amount
            </Label>
            <Input
              id="value"
              type="number"
              onChange={(e) => handleFormDataChange(e.target.value, "amount")}
              value={formData.amount}
              placeholder="Enter the amount"
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 
                        focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 
                        hover:bg-slate-800/70"
              required
            />
          </div>

          {/* Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="Notes" className="text-slate-300 font-medium">
              Notes
            </Label>
            <Input
              id="Notes"
              placeholder="Enter the Notes"
              onChange={(e) => handleFormDataChange(e.target.value, "notes")}
              value={formData.notes}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 
                        focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 
                        hover:bg-slate-800/70"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-sky-500 text-white font-semibold py-3 
                       transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Create Transaction"
            )}
          </Button>
        </form>
      </CardContent>

      {/* Floating Modals */}
      <FloatingComponent
        isOpen={showAddAccount}
        onClose={() => setShowAddAccount(false)}
        title="Add Account"
      >
        <FormAccount />
      </FloatingComponent>
    </Card>
  );
}

export default FormTransaction;
