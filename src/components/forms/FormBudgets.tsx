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
import FormCategory from "./FormCategory";
import useGetData from "@/hooks/useGetData";
import {  categories } from "@/generated/prisma";
import PortalComponent from "../PortalComponent";
// 👉 crearías algo similar para categorías

function FormBudgets() {
  const [formData, setFormData] = useState({
    amount: "",
    typeId: "",
    categoryId: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useGetData<categories[]>("/categories");

  const handleShowAdd = () => {
    setShowAddCategory((showAddCategory) => !showAddCategory);
    refetchCategories();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const thisYear = new Date().getFullYear();
      const thisMonth = new Date().getMonth() + 1; // Los meses en
      await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_id: formData.categoryId
            ? parseInt(formData.categoryId)
            : null,
          amount: parseFloat(formData.amount),
          month: thisYear,
          month_num: thisMonth,
        }),
      });

      setIsLoading(false);
    } catch (error: unknown) {
      setError("An error occurred while creating the transaction.");
    }
  };
  const handleFormDataChange = (
    value: string,
    type: "amount" | "categoryId"
  ) => {
    setFormData((prev) => ({ ...prev, [type]: value }));
  };
  return (
    <Card className="login-card shadow-2xl">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
      {showAddCategory && (
        <PortalComponent
          title="New Category"
          onClose={handleShowAdd} // 👈 idem acá
        >
          <FormCategory />
        </PortalComponent>
      )}
    </Card>
  );
}

export default FormBudgets;
