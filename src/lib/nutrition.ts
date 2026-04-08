import type { Recipe, RecipeIngredient, Food, Nutrient, NutrientSummary, CookingLog } from "@/types";

export function calculateIngredientNutrients(
  ingredient: RecipeIngredient,
  food: Food | undefined
): NutrientSummary[] {
  if (!food) return [];
  const grams = ingredient.gramsUsed;
  return food.nutrients.map((fn) => ({
    nutrientId: fn.nutrientId,
    name: "",
    unit: "",
    amount: (grams / 100) * fn.amountPer100g,
  }));
}

export function calculateRecipeNutrients(
  recipe: Recipe,
  foods: Food[],
  nutrients: Nutrient[]
): NutrientSummary[] {
  const totals: Record<string, number> = {};

  for (const ing of recipe.ingredients) {
    const food = foods.find((f) => f.id === ing.foodId);
    if (!food) continue;
    const ingNutrients = calculateIngredientNutrients(ing, food);
    for (const n of ingNutrients) {
      totals[n.nutrientId] = (totals[n.nutrientId] || 0) + n.amount;
    }
  }

  return nutrients.map((n) => ({
    nutrientId: n.id,
    name: n.name,
    unit: n.unit,
    amount: totals[n.id] || 0,
  }));
}

export function calculateGramsUsed(
  quantityValue: number,
  unit: string,
  food: Food
): number {
  if (unit === "g") return quantityValue;
  if (unit === "ml") return quantityValue;
  if (unit === food.defaultUnit) return quantityValue * food.gramsPerUnit;
  return quantityValue * food.gramsPerUnit;
}

export function parseFraction(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  if (trimmed.includes("/")) {
    const parts = trimmed.split("/");
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (den === 0) return 0;
    return num / den;
  }
  return parseFloat(trimmed) || 0;
}

export function getWeeklyNutrients(
  logs: CookingLog[],
  recipes: Recipe[],
  foods: Food[],
  nutrients: Nutrient[],
  days: number = 7
): NutrientSummary[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const recentLogs = logs.filter((l) => new Date(l.cookedAt) >= cutoff);
  const totals: Record<string, number> = {};

  for (const log of recentLogs) {
    const recipe = recipes.find((r) => r.id === log.recipeId);
    if (!recipe) continue;
    const rn = calculateRecipeNutrients(recipe, foods, nutrients);
    for (const n of rn) {
      totals[n.nutrientId] = (totals[n.nutrientId] || 0) + n.amount;
    }
  }

  return nutrients
    .filter((n) => n.isRequired)
    .map((n) => ({
      nutrientId: n.id,
      name: n.name,
      unit: n.unit,
      amount: totals[n.id] || 0,
    }));
}
