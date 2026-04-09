import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import type { Food, FoodNutrient } from "@/types";

interface FoodFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Food;
  onSaved?: (food: Food) => void;
}

export default function FoodFormDialog({ open, onOpenChange, initial, onSaved }: FoodFormDialogProps) {
  const { nutrients, addFood, updateFood } = useApp();
  const { t } = useLanguage();
  const [name, setName] = useState(initial?.name || "");
  const [defaultUnit, setDefaultUnit] = useState(initial?.defaultUnit || "個");
  const [gramsPerUnit, setGramsPerUnit] = useState(initial?.gramsPerUnit?.toString() || "100");
  const [foodNutrients, setFoodNutrients] = useState<FoodNutrient[]>(initial?.nutrients || []);

  function resetForm() {
    if (!initial) {
      setName("");
      setDefaultUnit("個");
      setGramsPerUnit("100");
      setFoodNutrients([]);
    }
  }

  function handleSave() {
    if (!name.trim()) {
      toast.error(t("enterFoodName"));
      return;
    }
    const food: Food = {
      id: initial?.id || crypto.randomUUID(),
      name: name.trim(),
      defaultUnit,
      gramsPerUnit: parseFloat(gramsPerUnit) || 1,
      nutrients: foodNutrients.filter((fn) => fn.nutrientId),
    };
    if (initial) {
      updateFood(food);
      toast.success(t("foodUpdated"));
    } else {
      addFood(food);
      toast.success(t("foodAdded"));
    }
    onSaved?.(food);
    resetForm();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? t("editFood") : t("quickAddFood")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder={t("foodName")} value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex gap-2">
            <Input placeholder={t("unitLabel")} value={defaultUnit} onChange={(e) => setDefaultUnit(e.target.value)} className="w-24" />
            <Input placeholder={t("gramsPerUnit")} type="number" step="any" value={gramsPerUnit} onChange={(e) => setGramsPerUnit(e.target.value)} className="flex-1" />
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">{t("nutrientsPer100g")}</p>
            {foodNutrients.map((fn, idx) => (
              <div key={idx} className="mt-1 flex gap-2">
                <select
                  value={fn.nutrientId}
                  onChange={(e) =>
                    setFoodNutrients((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, nutrientId: e.target.value } : item))
                    )
                  }
                  className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm"
                >
                  <option value="">{t("selectNutrient")}</option>
                  {nutrients.map((n) => (
                    <option key={n.id} value={n.id}>{n.name} ({n.unit})</option>
                  ))}
                </select>
                <Input
                  type="number"
                  step="any"
                  placeholder={t("amountLabel")}
                  value={fn.amountPer100g || ""}
                  onChange={(e) =>
                    setFoodNutrients((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, amountPer100g: parseFloat(e.target.value) || 0 } : item))
                    )
                  }
                  className="w-24"
                />
                <button onClick={() => setFoodNutrients((prev) => prev.filter((_, i) => i !== idx))} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setFoodNutrients((prev) => [...prev, { nutrientId: "", amountPer100g: 0 }])} className="mt-1">
              <Plus className="mr-1 h-3 w-3" />
              {t("addNutrientItem")}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-1 h-3 w-3" />
              {t("save")}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}>
              <X className="mr-1 h-3 w-3" />
              {t("cancel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
