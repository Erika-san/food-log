export interface Nutrient {
  id: string;
  name: string;
  unit: string;
  isRequired: boolean;
}

export interface Unit {
  id: string;
  name: string;
}

export interface Food {
  id: string;
  name: string;
  defaultUnit: string;
  gramsPerUnit: number;
  nutrients: FoodNutrient[];
}

export interface FoodNutrient {
  nutrientId: string;
  amountPer100g: number;
}

export interface Recipe {
  id: string;
  name: string;
  servings: number;
  steps: string[];
  ingredients: RecipeIngredient[];
  createdAt: string;
}

export interface RecipeIngredient {
  foodId: string;
  quantityValue: number;
  quantityText: string;
  unit: string;
  gramsUsed: number;
}

export interface CookingLog {
  id: string;
  recipeId: string;
  cookedAt: string;
}

export interface NutrientSummary {
  nutrientId: string;
  name: string;
  unit: string;
  amount: number;
}
