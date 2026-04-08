import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/PageHeader";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import type { Nutrient, Food, FoodNutrient } from "@/types";

export default function MasterDataPage() {
  return (
    <div className="min-h-screen pb-20">
      <PageHeader title="マスターデータ" />
      <div className="p-4">
        <Tabs defaultValue="foods">
          <TabsList className="w-full">
            <TabsTrigger value="foods" className="flex-1">食材</TabsTrigger>
            <TabsTrigger value="nutrients" className="flex-1">栄養素</TabsTrigger>
          </TabsList>
          <TabsContent value="foods" className="mt-4">
            <FoodManager />
          </TabsContent>
          <TabsContent value="nutrients" className="mt-4">
            <NutrientManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function FoodManager() {
  const { foods, nutrients, addFood, updateFood, deleteFood } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-3">
      <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
        <Plus className="mr-1 h-3 w-3" />
        食材を追加
      </Button>

      {showAdd && (
        <FoodForm
          nutrients={nutrients}
          onSave={(f) => {
            addFood(f);
            setShowAdd(false);
            toast.success("食材を追加しました");
          }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      <div className="space-y-2">
        {foods.map((food) =>
          editingId === food.id ? (
            <FoodForm
              key={food.id}
              initial={food}
              nutrients={nutrients}
              onSave={(f) => {
                updateFood(f);
                setEditingId(null);
                toast.success("食材を更新しました");
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <Card key={food.id}>
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <span className="font-medium">{food.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    1{food.defaultUnit} = {food.gramsPerUnit}g
                  </span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditingId(food.id)} className="text-muted-foreground hover:text-foreground">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => { deleteFood(food.id); toast.success("削除しました"); }} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

function FoodForm({
  initial,
  nutrients,
  onSave,
  onCancel,
}: {
  initial?: Food;
  nutrients: Nutrient[];
  onSave: (f: Food) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [defaultUnit, setDefaultUnit] = useState(initial?.defaultUnit || "個");
  const [gramsPerUnit, setGramsPerUnit] = useState(initial?.gramsPerUnit?.toString() || "100");
  const [foodNutrients, setFoodNutrients] = useState<FoodNutrient[]>(initial?.nutrients || []);

  function handleAddNutrient() {
    setFoodNutrients((prev) => [...prev, { nutrientId: "", amountPer100g: 0 }]);
  }

  function updateFoodNutrient(idx: number, field: keyof FoodNutrient, value: string) {
    setFoodNutrients((prev) =>
      prev.map((fn, i) =>
        i === idx
          ? { ...fn, [field]: field === "amountPer100g" ? parseFloat(value) || 0 : value }
          : fn
      )
    );
  }

  function handleSave() {
    if (!name.trim()) {
      toast.error("食材名を入力してください");
      return;
    }
    onSave({
      id: initial?.id || crypto.randomUUID(),
      name: name.trim(),
      defaultUnit,
      gramsPerUnit: parseFloat(gramsPerUnit) || 1,
      nutrients: foodNutrients.filter((fn) => fn.nutrientId),
    });
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <Input placeholder="食材名" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex gap-2">
          <Input placeholder="単位" value={defaultUnit} onChange={(e) => setDefaultUnit(e.target.value)} className="w-24" />
          <Input placeholder="1単位あたりのg" type="number" value={gramsPerUnit} onChange={(e) => setGramsPerUnit(e.target.value)} className="flex-1" />
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">栄養素（100gあたり）</p>
          {foodNutrients.map((fn, idx) => (
            <div key={idx} className="mt-1 flex gap-2">
              <select
                value={fn.nutrientId}
                onChange={(e) => updateFoodNutrient(idx, "nutrientId", e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm"
              >
                <option value="">選択...</option>
                {nutrients.map((n) => (
                  <option key={n.id} value={n.id}>{n.name} ({n.unit})</option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="量"
                value={fn.amountPer100g || ""}
                onChange={(e) => updateFoodNutrient(idx, "amountPer100g", e.target.value)}
                className="w-24"
              />
              <button onClick={() => setFoodNutrients((prev) => prev.filter((_, i) => i !== idx))} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button size="sm" variant="ghost" onClick={handleAddNutrient} className="mt-1">
            <Plus className="mr-1 h-3 w-3" />
            栄養素を追加
          </Button>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-1 h-3 w-3" />
            保存
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            <X className="mr-1 h-3 w-3" />
            キャンセル
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NutrientManager() {
  const { nutrients, addNutrient, updateNutrient, deleteNutrient } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("mg");
  const [newRequired, setNewRequired] = useState(false);

  function handleAdd() {
    if (!newName.trim()) return;
    addNutrient({
      id: crypto.randomUUID(),
      name: newName.trim(),
      unit: newUnit,
      isRequired: newRequired,
    });
    setNewName("");
    setNewUnit("mg");
    setNewRequired(false);
    setShowAdd(false);
    toast.success("栄養素を追加しました");
  }

  return (
    <div className="space-y-3">
      <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
        <Plus className="mr-1 h-3 w-3" />
        栄養素を追加
      </Button>

      {showAdd && (
        <Card>
          <CardContent className="space-y-2 p-4">
            <Input placeholder="栄養素名" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Input placeholder="単位 (g, mg, kcal)" value={newUnit} onChange={(e) => setNewUnit(e.target.value)} className="w-32" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={newRequired} onChange={(e) => setNewRequired(e.target.checked)} />
              必須栄養素
            </label>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd}>保存</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>キャンセル</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {nutrients.map((n) => (
          <Card key={n.id}>
            <CardContent className="flex items-center justify-between p-3">
              <div>
                <span className="font-medium">{n.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{n.unit}</span>
                {n.isRequired && (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">必須</span>
                )}
              </div>
              <button
                onClick={() => {
                  deleteNutrient(n.id);
                  toast.success("削除しました");
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
