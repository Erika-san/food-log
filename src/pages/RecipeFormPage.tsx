import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { calculateGramsUsed, parseFraction, formatAmount } from "@/lib/nutrition";
import type { Recipe, RecipeIngredient, Food } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/PageHeader";
import FoodFormDialog from "@/components/FoodFormDialog";
import { Plus, Trash2, Save, Edit, PlusCircle } from "lucide-react";
import { toast } from "sonner";

export default function RecipeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, foods, addRecipe, updateRecipe } = useApp();
  const { t } = useLanguage();

  const existing = id ? recipes.find((r) => r.id === id) : undefined;

  const [name, setName] = useState(existing?.name || "");
  const [servings, setServings] = useState(existing?.servings?.toString() || "2");
  const [steps, setSteps] = useState<string[]>(existing?.steps || [""]);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    existing?.ingredients || []
  );

  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [qtyText, setQtyText] = useState("");
  const [unitText, setUnitText] = useState("");
  const [gramsDirectInputVal, setGramsDirectInputVal] = useState("");
  const [foodSearch, setFoodSearch] = useState("");
  const [showFoodDialog, setShowFoodDialog] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | undefined>(undefined);

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  function addIngredient() {
    const food = foods.find((f) => f.id === selectedFoodId);
    if (!food) {
      toast.error(t("selectFood"));
      return;
    }

    const qv = parseFraction(qtyText);
    const unit = unitText || food.defaultUnit;
    let grams: number;

    if (gramsDirectInputVal) {
      grams = parseFloat(gramsDirectInputVal) || 0;
    } else {
      grams = calculateGramsUsed(qv, unit, food);
    }

    const ing: RecipeIngredient = {
      foodId: food.id,
      quantityValue: qv,
      quantityText: qtyText,
      unit,
      gramsUsed: grams,
    };

    setIngredients((prev) => [...prev, ing]);
    setSelectedFoodId("");
    setQtyText("");
    setUnitText("");
    setGramsDirectInputVal("");
    setFoodSearch("");
  }

  function removeIngredient(idx: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleStepChange(idx: number, value: string) {
    setSteps((prev) => prev.map((s, i) => (i === idx ? value : s)));
  }

  function addStep() {
    setSteps((prev) => [...prev, ""]);
  }

  function removeStep(idx: number) {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    if (!name.trim()) {
      toast.error(t("enterRecipeName"));
      return;
    }

    const recipe: Recipe = {
      id: existing?.id || crypto.randomUUID(),
      name: name.trim(),
      servings: parseInt(servings) || 0,
      steps: steps.filter((s) => s.trim()),
      ingredients,
      createdAt: existing?.createdAt || new Date().toISOString(),
    };

    if (existing) {
      updateRecipe(recipe);
      toast.success(t("recipeUpdated"));
    } else {
      addRecipe(recipe);
      toast.success(t("recipeCreated"));
    }
    navigate(`/recipes/${recipe.id}`);
  }

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title={existing ? t("editRecipe") : t("newRecipe")}
        showBack
        action={
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-1 h-4 w-4" />
            {t("save")}
          </Button>
        }
      />

      <div className="space-y-4 p-4">
        <Card>
          <CardContent className="space-y-3 p-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("recipeName")}</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("recipeNamePlaceholder")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("servings")}</label>
              <Input
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                placeholder="2"
                className="w-24"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4">
            <h3 className="font-semibold">{t("ingredients")}</h3>

            {ingredients.map((ing, idx) => {
              const food = foods.find((f) => f.id === ing.foodId);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-border p-2"
                >
                  <div>
                    <span className="font-medium">{food?.name || t("unknown")}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {ing.quantityText || ing.quantityValue} {ing.unit}
                      <span className="ml-1">({formatAmount(ing.gramsUsed)}g)</span>
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {food && (
                      <button
                        onClick={() => { setEditingFood(food); setShowFoodDialog(true); }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeIngredient(idx)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
              <label className="text-xs font-medium text-muted-foreground">{t("addIngredient")}</label>
              <Input
                placeholder={t("searchFood")}
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
              />
              {foodSearch && (
                <div className="max-h-32 overflow-y-auto rounded-lg border border-border">
                  {filteredFoods.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedFoodId(f.id);
                        setUnitText(f.defaultUnit);
                        setFoodSearch(f.name);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-sm hover:bg-secondary ${
                        selectedFoodId === f.id ? "bg-secondary font-medium" : ""
                      }`}
                    >
                      {f.name}
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({f.defaultUnit})
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setEditingFood(undefined); setShowFoodDialog(true); }}
                className="text-xs"
              >
                <PlusCircle className="mr-1 h-3 w-3" />
                {t("createNewFood")}
              </Button>

              <div className="flex gap-2">
                <Input
                  placeholder={t("quantity")}
                  value={qtyText}
                  onChange={(e) => setQtyText(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder={t("unit")}
                  value={unitText}
                  onChange={(e) => setUnitText(e.target.value)}
                  className="w-20"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t("gramsDirectInput")}
                  value={gramsDirectInputVal}
                  onChange={(e) => setGramsDirectInputVal(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" variant="outline" onClick={addIngredient}>
                  <Plus className="mr-1 h-3 w-3" />
                  {t("add")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4">
            <h3 className="font-semibold">{t("steps")}</h3>
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="mt-2 text-sm font-medium text-muted-foreground">
                  {idx + 1}.
                </span>
                <Textarea
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  placeholder={t("stepPlaceholder", { n: String(idx + 1) })}
                  rows={2}
                  className="flex-1"
                />
                <button
                  onClick={() => removeStep(idx)}
                  className="mt-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={addStep}>
              <Plus className="mr-1 h-3 w-3" />
              {t("addStep")}
            </Button>
          </CardContent>
        </Card>
      </div>

      <FoodFormDialog
        open={showFoodDialog}
        onOpenChange={setShowFoodDialog}
        initial={editingFood}
        onSaved={(food) => {
          if (!editingFood) {
            setSelectedFoodId(food.id);
            setUnitText(food.defaultUnit);
            setFoodSearch(food.name);
          }
        }}
      />
    </div>
  );
}
