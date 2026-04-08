import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { calculateRecipeNutrients } from "@/lib/nutrition";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import NutrientBadges from "@/components/NutrientBadges";
import PageHeader from "@/components/PageHeader";

export default function RecipeListPage() {
  const { recipes, foods, nutrients } = useApp();
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");

  const filtered = recipes.filter((r) => {
    const q = search.toLowerCase();
    if (!q) return true;
    if (r.name.toLowerCase().includes(q)) return true;
    return r.ingredients.some((ing) => {
      const food = foods.find((f) => f.id === ing.foodId);
      return food?.name.toLowerCase().includes(q);
    });
  });

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title={t("recipeListTitle")}
        action={
          <Link to="/recipes/new">
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              {t("createNew")}
            </Button>
          </Link>
        }
      />

      <div className="space-y-3 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-muted-foreground">
              {recipes.length === 0 ? t("noRecipes") : t("noSearchResults")}
            </p>
            {recipes.length === 0 && (
              <Link to="/recipes/new">
                <Button>{t("createFirstRecipe")}</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((recipe) => {
              const rn = calculateRecipeNutrients(recipe, foods, nutrients);
              return (
                <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                  <Card className="transition-colors hover:bg-secondary">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{recipe.name}</h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {t("ingredientCount")} {recipe.ingredients.length}{language === "ja" ? "品" : ""}
                            {recipe.servings > 0 && ` · ${recipe.servings}${t("servingsUnit")}`}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <NutrientBadges summaries={rn} compact />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
