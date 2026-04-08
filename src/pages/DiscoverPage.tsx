import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { getWeeklyNutrients } from "@/lib/nutrition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";

export default function DiscoverPage() {
  const [searchParams] = useSearchParams();
  const selectedNutrient = searchParams.get("nutrient");
  const { nutrients, foods, recipes, cookingLogs } = useApp();

  const weeklyNutrients = getWeeklyNutrients(cookingLogs, recipes, foods, nutrients);

  const lowNutrients = useMemo(
    () => [...weeklyNutrients].sort((a, b) => a.amount - b.amount),
    [weeklyNutrients]
  );

  const activeNutrientId = selectedNutrient || lowNutrients[0]?.nutrientId;

  // Find foods rich in this nutrient
  const richFoods = useMemo(() => {
    if (!activeNutrientId) return [];
    return foods
      .map((f) => {
        const fn = f.nutrients.find((n) => n.nutrientId === activeNutrientId);
        return { food: f, amount: fn?.amountPer100g || 0 };
      })
      .filter((x) => x.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [activeNutrientId, foods]);

  // Find recipes using these foods
  const relatedRecipes = useMemo(() => {
    const richFoodIds = new Set(richFoods.slice(0, 5).map((rf) => rf.food.id));
    return recipes.filter((r) =>
      r.ingredients.some((ing) => richFoodIds.has(ing.foodId))
    );
  }, [richFoods, recipes]);

  const activeNutrient = nutrients.find((n) => n.id === activeNutrientId);

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title="栄養素から発見" />

      <div className="space-y-4 p-4">
        {/* Nutrient selector */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">不足しがちな栄養素</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowNutrients.map((n) => (
                <Link
                  key={n.nutrientId}
                  to={`/discover?nutrient=${n.nutrientId}`}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    n.nutrientId === activeNutrientId
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {n.name}
                  <span className="ml-1 opacity-75">
                    {Math.round(n.amount)}{n.unit}
                  </span>
                </Link>
              ))}
            </div>
            {cookingLogs.length === 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                調理記録を追加すると、不足している栄養素が表示されます
              </p>
            )}
          </CardContent>
        </Card>

        {/* Rich foods */}
        {activeNutrient && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {activeNutrient.name}が豊富な食材
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {richFoods.slice(0, 10).map(({ food, amount }) => (
                  <div
                    key={food.id}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 odd:bg-secondary/50"
                  >
                    <span className="text-sm font-medium">{food.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {amount < 1 ? amount.toFixed(2) : Math.round(amount)} {activeNutrient.unit}/100g
                    </span>
                  </div>
                ))}
                {richFoods.length === 0 && (
                  <p className="text-sm text-muted-foreground">該当する食材がありません</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related recipes */}
        {relatedRecipes.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">おすすめレシピ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {relatedRecipes.map((r) => (
                  <Link
                    key={r.id}
                    to={`/recipes/${r.id}`}
                    className="block rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
