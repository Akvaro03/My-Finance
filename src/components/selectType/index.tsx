import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

function SelectType({
  valueSelected,
  onChange,
  isDisable = false
}: {
  valueSelected: string;
  onChange: (value: string) => void;
  isDisable?: boolean
}) {
  return (
    <div className="flex gap-2 items-center space-y-2">
      <ToggleGroup
        type="single"
        value={valueSelected}
        onValueChange={onChange}
        className="flex gap-2"
        disabled={isDisable}
      >
        <ToggleGroupItem
          value="1"
          aria-label="Income"
          className={`flex-1 px-4 py-2 rounded-lg border border-slate-600 text-white 
                  ${valueSelected === "1"
              ? "bg-green-600"
              : "bg-slate-800 hover:bg-slate-700"
            }`}
        >
          Income
        </ToggleGroupItem>
        <ToggleGroupItem
          value="2"
          aria-label="Expense"
          className={`flex-1 px-4 py-2 rounded-lg border border-slate-600 text-white 
                  ${valueSelected === "2"
              ? "bg-blue-600"
              : "bg-slate-800 hover:bg-slate-700"
            }`}

        >
          Expense
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export default SelectType;
