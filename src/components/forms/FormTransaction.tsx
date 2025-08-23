import { useState } from "react";
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
import FormAccount from "./FormAccount";
import FormCategory from "./FormCategory";
import useGetData from "@/hooks/useGetData";
import { accounts, categories } from "@/generated/prisma";
import SelectType from "../selectType";
import PortalComponent from "../PortalComponent";
// 👉 crearías algo similar para categorías

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
  const [showAddCategory, setShowAddCategory] = useState(false);
  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    refetch: refetchAccounts,
  } = useGetData<accounts[]>("/account");
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useGetData<categories[]>("/categories");

  const handleShowAdd = (type: "account" | "category") => {
    if (type === "account") {
      setShowAddAccount((showAddAccount) => !showAddAccount);
    } else if (type === "category") {
      setShowAddCategory((showAddCategory) => !showAddCategory);
    }
    refetchAccounts();
    refetchCategories();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const typeFormat = formData.categoryId === "0" ? undefined :
        parseInt(formData.categoryId)
      await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: parseInt(formData.accountId),
          category_id: typeFormat
          ,
          type: formData.typeId === "1" ? "income" : "expense",
          amount: parseFloat(formData.amount),
          notes: formData.notes,
        }),
      });

      setIsLoading(false);
    } catch (error: unknown) {
      setError("An error occurred while creating the transaction.");
    }
  };
  const handleFormDataChange = (
    value: string,
    type: "amount" | "typeId" | "notes" | "accountId" | "categoryId"
  ) => {
    if (categories && type === "categoryId" && value !== "0") {

      const typeId = categories[Number(value) - 1].type === "income" ? 1 : 2;

      setFormData(prev => ({ ...prev, typeId: String(typeId) }));
    }
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
                <SelectContent className="bg-slate-800 border border-slate-600 text-white">
                  {accounts && accounts[0] ? (
                    accounts.map((acc) => (
                      <SelectItem
                        key={acc.id}
                        value={acc.id.toString()}
                        className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                      >
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
          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="account" className="text-slate-300 font-medium">
              Category
            </Label>
            <div className="flex gap-2 items-center">
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  handleFormDataChange(value, "categoryId")
                }
              >
                <SelectTrigger className="flex-1 bg-slate-800/50 border-slate-600 text-white">
                  <SelectValue
                    placeholder={
                      isLoadingCategories ? "Loading..." : "Select Category"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border border-slate-600 text-white">
                  <SelectItem
                    value={"0"}
                    className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                  >
                    None
                  </SelectItem>
                  {categories && categories[0] ? (
                    categories.map((acc) => (
                      <SelectItem
                        key={acc.id}
                        value={acc.id.toString()}
                        className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                      >
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
                onClick={() => setShowAddCategory(true)}
                className="border-slate-600 hover:bg-slate-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
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

          {/* Type Field */}
          <SelectType
            valueSelected={formData.typeId}
            onChange={(value) => handleFormDataChange(value, "typeId")}
            isDisable={Number(formData.categoryId) > 0}
          />

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

          {/* Submit Button   */}
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
      {showAddAccount && (
        <PortalComponent
          title="New Account"
          onClose={() => handleShowAdd("account")} // 👈 se sincroniza con el estado
        >
          <FormAccount />
        </PortalComponent>
      )}
      {showAddCategory && (
        <PortalComponent
          title="New Category"
          onClose={() => handleShowAdd("category")} // 👈 idem acá
        >
          <FormCategory />
        </PortalComponent>
      )}
    </Card>
  );
}

export default FormTransaction;
