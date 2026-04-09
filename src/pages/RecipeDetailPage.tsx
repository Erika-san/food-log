import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { calculateRecipeNutrients, formatAmount } from "@/lib/nutrition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NutrientBadges from "@/components/NutrientBadges";
import PageHeader from "@/components/PageHeader";
import { Edit, Trash2, CookingPot } from "lucide-react";
import { toast } from "sonner";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, foods, nutrients, addCookingLog, deleteRecipe } = useApp();
  const { t } = useLanguage();

  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-20">
        <p className="text-muted-foreground">{t("recipeNotFound")}</p>
      </div>
    );
  }

  const rn = calculateRecipeNutrients(recipe, foods, nutrients);

  function handleCooked() {
    addCookingLog({
      id: crypto.randomUUID(),
      recipeId: recipe!.id,
      cookedAt: new Date().toISOString(),
    });
    toast.success(t("cookingLogged"));
  }

  function handleDelete() {
    if (confirm(t("deleteRecipeConfirm"))) {
      deleteRecipe(recipe!.id);
      toast.success(t("recipeDeleted"));
      navigate("/recipes");
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title={recipe.name}
        showBack
        action={
          <div className="flex gap-2">
            <Link to={`/recipes/${recipe.id}/edit`}>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={handleDelete} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="space-y-4 p-4">
        <Button onClick={handleCooked} className="w-full" size="lg">
          <CookingPot className="mr-2 h-5 w-5" />
          {t("cooked")}
        </Button>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("nutrition")}</CardTitle>
          </CardHeader>
          <CardContent>
            <NutrientBadges summaries={rn} />
            <div className="mt-3 space-y-1">
              {rn
                .filter((n) => n.amount > 0)
                .map((n) => (
                  <div key={n.nutrientId} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{n.name}</span>
                    <span>
                      {formatAmount(n.amount)} {n.unit}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("ingredientsSection")}</CardTitle>
            {recipe.servings > 0 && (
              <p className="text-xs text-muted-foreground">{recipe.servings}{t("servingsUnit")}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {recipe.ingredients.map((ing, idx) => {
                const food = foods.find((f) => f.id === ing.foodId);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-md px-2 py-1 odd:bg-secondary/50"
                  >
                    <span className="text-sm font-medium">{food?.name || t("unknown")}</span>
                    <span className="text-sm text-muted-foreground">
                      {ing.quantityText || ing.quantityValue} {ing.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {recipe.steps.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t("stepsSection")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {recipe.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
