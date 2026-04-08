import type { NutrientSummary } from "@/types";

interface NutrientBadgesProps {
  summaries: NutrientSummary[];
  compact?: boolean;
}

const nutrientColors: Record<string, string> = {
  energy: "bg-nutrient-calorie text-primary-foreground",
  protein: "bg-nutrient-protein text-primary-foreground",
  fat: "bg-nutrient-fat text-primary-foreground",
  carb: "bg-nutrient-carb text-primary-foreground",
};

export default function NutrientBadges({ summaries, compact }: NutrientBadgesProps) {
  const mainNutrients = summaries.filter((s) =>
    ["energy", "protein", "fat", "carb"].includes(s.nutrientId)
  );

  return (
    <div className="flex flex-wrap gap-1.5">
      {mainNutrients.map((s) => (
        <span
          key={s.nutrientId}
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            nutrientColors[s.nutrientId] || "bg-secondary text-secondary-foreground"
          }`}
        >
          {compact ? s.name.charAt(0) : s.name}
          <span className="font-bold">{Math.round(s.amount)}</span>
          {!compact && <span className="opacity-75">{s.unit}</span>}
        </span>
      ))}
    </div>
  );
}
