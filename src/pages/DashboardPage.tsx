import { useApp } from "@/store/AppContext";
import { getWeeklyNutrients, calculateRecipeNutrients } from "@/lib/nutrition";
import { Link } from "react-router-dom";
import { Plus, ChefHat, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NutrientBadges from "@/components/NutrientBadges";
import PageHeader from "@/components/PageHeader";

export default function DashboardPage() {
  const { recipes, cookingLogs, foods, nutrients } = useApp();

  const weeklyNutrients = getWeeklyNutrients(cookingLogs, recipes, foods, nutrients);
  const recentLogs = [...cookingLogs]
    .sort((a, b) => new Date(b.cookedAt).getTime() - new Date(a.cookedAt).getTime())
    .slice(0, 5);

  const lowNutrients = [...weeklyNutrients]
    .sort((a, b) => a.amount - b.amount)
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        title="🍽️ ごはん記録"
        action={
          <Link to="/recipes/new">
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              レシピ追加
            </Button>
          </Link>
        }
      />

      <div className="space-y-4 p-4">
        {/* Weekly Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">📊 過去7日間の栄養</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyNutrients.length > 0 && cookingLogs.length > 0 ? (
              <div className="space-y-2">
                {weeklyNutrients
                  .filter((n) => ["energy", "protein", "fat", "carb"].includes(n.nutrientId))
                  .map((n) => (
                    <div key={n.nutrientId} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{n.name}</span>
                      <span className="font-semibold">
                        {Math.round(n.amount)} {n.unit}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                まだ料理の記録がありません。レシピを作って「作った」ボタンを押しましょう！
              </p>
            )}
          </CardContent>
        </Card>

        {/* Low Nutrients */}
        {cookingLogs.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingDown className="h-4 w-4 text-warning" />
                不足しがちな栄養素
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowNutrients.map((n) => (
                  <Link
                    key={n.nutrientId}
                    to={`/discover?nutrient=${n.nutrientId}`}
                    className="flex items-center justify-between rounded-lg border border-border p-2 transition-colors hover:bg-secondary"
                  >
                    <span className="text-sm">{n.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(n.amount)} {n.unit}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Cooking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ChefHat className="h-4 w-4" />
              最近作った料理
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length > 0 ? (
              <div className="space-y-2">
                {recentLogs.map((log) => {
                  const recipe = recipes.find((r) => r.id === log.recipeId);
                  if (!recipe) return null;
                  const rn = calculateRecipeNutrients(recipe, foods, nutrients);
                  return (
                    <Link
                      key={log.id}
                      to={`/recipes/${recipe.id}`}
                      className="block rounded-lg border border-border p-3 transition-colors hover:bg-secondary"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{recipe.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.cookedAt).toLocaleDateString("ja-JP")}
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <NutrientBadges summaries={rn} compact />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">まだ記録がありません</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/recipes">
            <Card className="cursor-pointer transition-colors hover:bg-secondary">
              <CardContent className="flex items-center gap-2 p-4">
                <BookOpenIcon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">レシピ一覧</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/history">
            <Card className="cursor-pointer transition-colors hover:bg-secondary">
              <CardContent className="flex items-center gap-2 p-4">
                <HistoryIcon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">調理履歴</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function HistoryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
    </svg>
  );
}
