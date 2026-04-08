import { useApp } from "@/store/AppContext";
import { calculateRecipeNutrients } from "@/lib/nutrition";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import NutrientBadges from "@/components/NutrientBadges";
import PageHeader from "@/components/PageHeader";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CookingHistoryPage() {
  const { cookingLogs, recipes, foods, nutrients, deleteCookingLog } = useApp();

  const sorted = [...cookingLogs].sort(
    (a, b) => new Date(b.cookedAt).getTime() - new Date(a.cookedAt).getTime()
  );

  // Group by date
  const grouped: Record<string, typeof sorted> = {};
  for (const log of sorted) {
    const dateKey = new Date(log.cookedAt).toLocaleDateString("ja-JP");
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(log);
  }

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title="調理履歴" />

      <div className="space-y-4 p-4">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-muted-foreground">まだ調理の記録がありません</p>
            <Link to="/recipes" className="text-sm text-primary underline">
              レシピ一覧へ
            </Link>
          </div>
        ) : (
          Object.entries(grouped).map(([date, logs]) => (
            <div key={date}>
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{date}</h3>
              <div className="space-y-2">
                {logs.map((log) => {
                  const recipe = recipes.find((r) => r.id === log.recipeId);
                  if (!recipe) return null;
                  const rn = calculateRecipeNutrients(recipe, foods, nutrients);
                  return (
                    <Card key={log.id}>
                      <CardContent className="flex items-center justify-between p-3">
                        <Link to={`/recipes/${recipe.id}`} className="flex-1">
                          <span className="font-medium">{recipe.name}</span>
                          <div className="mt-1">
                            <NutrientBadges summaries={rn} compact />
                          </div>
                        </Link>
                        <button
                          onClick={() => {
                            deleteCookingLog(log.id);
                            toast.success("記録を削除しました");
                          }}
                          className="ml-2 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
