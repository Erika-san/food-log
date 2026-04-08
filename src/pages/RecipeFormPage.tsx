import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { calculateGramsUsed, parseFraction } from "@/lib/nutrition";
import type { Recipe, RecipeIngredient } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/PageHeader";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export default function RecipeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, foods, addRecipe, updateRecipe } = useApp();

  const existing = id ? recipes.find((r) => r.id === id) : undefined;

  const [name, setName] = useState(existing?.name || "");
  const [servings, setServings] = useState(existing?.servings?.toString() || "2");
  const [steps, setSteps] = useState<string[]>(existing?.steps || [""]);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    existing?.ingredients || []
  );

  // Ingredient editing
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [qtyText, setQtyText] = useState("");
  const [unitText, setUnitText] = useState("");
  const [gramsDirectInput, setGramsDirectInput] = useState("");
  const [foodSearch, setFoodSearch] = useState("");

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  function addIngredient() {
    const food = foods.find((f) => f.id === selectedFoodId);
    if (!food) {
      toast.error("食材を選択してください");
      return;
    }

    const qv = parseFraction(qtyText);
    const unit = unitText || food.defaultUnit;
    let grams: number;

    if (gramsDirectInput) {
      grams = parseFloat(gramsDirectInput) || 0;
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
    setGramsDirectInput("");
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
      toast.error("レシピ名を入力してください");
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
      toast.success("レシピを更新しました");
    } else {
      addRecipe(recipe);
      toast.success("レシピを作成しました");
    }
    navigate(`/recipes/${recipe.id}`);
  }

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title={existing ? "レシピ編集" : "新しいレシピ"}
        showBack
        action={
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-1 h-4 w-4" />
            保存
          </Button>
        }
      />

      <div className="space-y-4 p-4">
        {/* Basic Info */}
        <Card>
          <CardContent className="space-y-3 p-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">レシピ名</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 親子丼"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">人数</label>
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

        {/* Ingredients */}
        <Card>
          <CardContent className="space-y-3 p-4">
            <h3 className="font-semibold">🥘 材料</h3>

            {ingredients.map((ing, idx) => {
              const food = foods.find((f) => f.id === ing.foodId);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-border p-2"
                >
                  <div>
                    <span className="font-medium">{food?.name || "不明"}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {ing.quantityText || ing.quantityValue} {ing.unit}
                      <span className="ml-1">({Math.round(ing.gramsUsed)}g)</span>
                    </span>
                  </div>
                  <button
                    onClick={() => removeIngredient(idx)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}

            {/* Add ingredient form */}
            <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
              <label className="text-xs font-medium text-muted-foreground">食材を追加</label>
              <Input
                placeholder="食材名で検索..."
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

              <div className="flex gap-2">
                <Input
                  placeholder="数量 (例: 1/2)"
                  value={qtyText}
                  onChange={(e) => setQtyText(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="単位"
                  value={unitText}
                  onChange={(e) => setUnitText(e.target.value)}
                  className="w-20"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="直接g入力（任意）"
                  value={gramsDirectInput}
                  onChange={(e) => setGramsDirectInput(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" variant="outline" onClick={addIngredient}>
                  <Plus className="mr-1 h-3 w-3" />
                  追加
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardContent className="space-y-3 p-4">
            <h3 className="font-semibold">📝 手順</h3>
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="mt-2 text-sm font-medium text-muted-foreground">
                  {idx + 1}.
                </span>
                <Textarea
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  placeholder={`手順${idx + 1}を入力...`}
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
              手順を追加
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
