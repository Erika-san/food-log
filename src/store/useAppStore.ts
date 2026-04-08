import { useState, useCallback, useEffect } from "react";
import type { Nutrient, Food, Unit, Recipe, CookingLog } from "@/types";
import { defaultNutrients, defaultFoods, defaultUnits } from "@/data/seed";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}

function saveToStorage(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useAppStore() {
  const [nutrients, setNutrients] = useState<Nutrient[]>(() =>
    loadFromStorage("nutrients", defaultNutrients)
  );
  const [foods, setFoods] = useState<Food[]>(() =>
    loadFromStorage("foods", defaultFoods)
  );
  const [units, setUnits] = useState<Unit[]>(() =>
    loadFromStorage("units", defaultUnits)
  );
  const [recipes, setRecipes] = useState<Recipe[]>(() =>
    loadFromStorage("recipes", [])
  );
  const [cookingLogs, setCookingLogs] = useState<CookingLog[]>(() =>
    loadFromStorage("cookingLogs", [])
  );

  useEffect(() => saveToStorage("nutrients", nutrients), [nutrients]);
  useEffect(() => saveToStorage("foods", foods), [foods]);
  useEffect(() => saveToStorage("units", units), [units]);
  useEffect(() => saveToStorage("recipes", recipes), [recipes]);
  useEffect(() => saveToStorage("cookingLogs", cookingLogs), [cookingLogs]);

  const addNutrient = useCallback((n: Nutrient) => setNutrients((prev) => [...prev, n]), []);
  const updateNutrient = useCallback((n: Nutrient) => setNutrients((prev) => prev.map((x) => (x.id === n.id ? n : x))), []);
  const deleteNutrient = useCallback((id: string) => setNutrients((prev) => prev.filter((x) => x.id !== id)), []);

  const addFood = useCallback((f: Food) => setFoods((prev) => [...prev, f]), []);
  const updateFood = useCallback((f: Food) => setFoods((prev) => prev.map((x) => (x.id === f.id ? f : x))), []);
  const deleteFood = useCallback((id: string) => setFoods((prev) => prev.filter((x) => x.id !== id)), []);

  const addRecipe = useCallback((r: Recipe) => setRecipes((prev) => [...prev, r]), []);
  const updateRecipe = useCallback((r: Recipe) => setRecipes((prev) => prev.map((x) => (x.id === r.id ? r : x))), []);
  const deleteRecipe = useCallback((id: string) => setRecipes((prev) => prev.filter((x) => x.id !== id)), []);

  const addCookingLog = useCallback((log: CookingLog) => setCookingLogs((prev) => [...prev, log]), []);
  const deleteCookingLog = useCallback((id: string) => setCookingLogs((prev) => prev.filter((x) => x.id !== id)), []);

  return {
    nutrients, addNutrient, updateNutrient, deleteNutrient,
    foods, addFood, updateFood, deleteFood,
    units, setUnits,
    recipes, addRecipe, updateRecipe, deleteRecipe,
    cookingLogs, addCookingLog, deleteCookingLog,
  };
}

export type AppStore = ReturnType<typeof useAppStore>;
