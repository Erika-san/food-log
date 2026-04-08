export type Language = "ja" | "en";

export const translations = {
  // Common
  save: { ja: "保存", en: "Save" },
  cancel: { ja: "キャンセル", en: "Cancel" },
  delete: { ja: "削除", en: "Delete" },
  add: { ja: "追加", en: "Add" },
  search: { ja: "検索", en: "Search" },
  required: { ja: "必須", en: "Required" },
  unknown: { ja: "不明", en: "Unknown" },
  deleted: { ja: "削除しました", en: "Deleted" },

  // Navigation
  navHome: { ja: "ホーム", en: "Home" },
  navRecipes: { ja: "レシピ", en: "Recipes" },
  navHistory: { ja: "履歴", en: "History" },
  navDiscover: { ja: "発見", en: "Discover" },
  navData: { ja: "データ", en: "Data" },

  // Dashboard
  dashboardTitle: { ja: "🍽️ ごはん記録", en: "🍽️ Meal Tracker" },
  addRecipe: { ja: "レシピ追加", en: "Add Recipe" },
  weeklyNutrition: { ja: "📊 過去7日間の栄養", en: "📊 Nutrition (Last 7 Days)" },
  noRecordsYet: {
    ja: "まだ料理の記録がありません。レシピを作って「作った」ボタンを押しましょう！",
    en: "No cooking records yet. Create a recipe and press the \"Cooked\" button!",
  },
  lowNutrients: { ja: "不足しがちな栄養素", en: "Lacking Nutrients" },
  recentCooking: { ja: "最近作った料理", en: "Recently Cooked" },
  noRecords: { ja: "まだ記録がありません", en: "No records yet" },
  recipeList: { ja: "レシピ一覧", en: "Recipe List" },
  cookingHistory: { ja: "調理履歴", en: "Cooking History" },

  // Recipe List
  recipeListTitle: { ja: "レシピ一覧", en: "Recipes" },
  createNew: { ja: "新規作成", en: "Create" },
  searchPlaceholder: { ja: "レシピ名・食材で検索...", en: "Search recipes or ingredients..." },
  noRecipes: { ja: "レシピがまだありません", en: "No recipes yet" },
  noSearchResults: { ja: "検索結果がありません", en: "No results found" },
  createFirstRecipe: { ja: "最初のレシピを作る", en: "Create First Recipe" },
  ingredientCount: { ja: "材料", en: "Ingredients" },
  items: { ja: "品", en: "" },
  servingsUnit: { ja: "人前", en: "servings" },

  // Recipe Form
  editRecipe: { ja: "レシピ編集", en: "Edit Recipe" },
  newRecipe: { ja: "新しいレシピ", en: "New Recipe" },
  recipeName: { ja: "レシピ名", en: "Recipe Name" },
  recipeNamePlaceholder: { ja: "例: 親子丼", en: "e.g. Chicken Bowl" },
  servings: { ja: "人数", en: "Servings" },
  ingredients: { ja: "🥘 材料", en: "🥘 Ingredients" },
  addIngredient: { ja: "食材を追加", en: "Add Ingredient" },
  searchFood: { ja: "食材名で検索...", en: "Search food..." },
  quantity: { ja: "数量 (例: 1/2)", en: "Qty (e.g. 1/2)" },
  unit: { ja: "単位", en: "Unit" },
  gramsDirectInput: { ja: "直接g入力（任意）", en: "Direct g input (optional)" },
  steps: { ja: "📝 手順", en: "📝 Steps" },
  stepPlaceholder: { ja: "手順{n}を入力...", en: "Enter step {n}..." },
  addStep: { ja: "手順を追加", en: "Add Step" },
  selectFood: { ja: "食材を選択してください", en: "Please select a food" },
  enterRecipeName: { ja: "レシピ名を入力してください", en: "Please enter a recipe name" },
  recipeUpdated: { ja: "レシピを更新しました", en: "Recipe updated" },
  recipeCreated: { ja: "レシピを作成しました", en: "Recipe created" },

  // Recipe Detail
  nutrition: { ja: "🥗 栄養素", en: "🥗 Nutrition" },
  ingredientsSection: { ja: "🥘 材料", en: "🥘 Ingredients" },
  stepsSection: { ja: "📝 手順", en: "📝 Steps" },
  cooked: { ja: "作った！", en: "Cooked!" },
  cookingLogged: { ja: "調理記録を追加しました！🎉", en: "Cooking logged! 🎉" },
  deleteRecipeConfirm: { ja: "このレシピを削除しますか？", en: "Delete this recipe?" },
  recipeDeleted: { ja: "レシピを削除しました", en: "Recipe deleted" },
  recipeNotFound: { ja: "レシピが見つかりません", en: "Recipe not found" },

  // Cooking History
  cookingHistoryTitle: { ja: "調理履歴", en: "Cooking History" },
  noCookingHistory: { ja: "まだ調理の記録がありません", en: "No cooking history yet" },
  goToRecipes: { ja: "レシピ一覧へ", en: "Go to Recipes" },
  recordDeleted: { ja: "記録を削除しました", en: "Record deleted" },

  // Discover
  discoverTitle: { ja: "栄養素から発見", en: "Discover by Nutrient" },
  lackingNutrients: { ja: "不足しがちな栄養素", en: "Lacking Nutrients" },
  addCookingRecords: {
    ja: "調理記録を追加すると、不足している栄養素が表示されます",
    en: "Add cooking records to see lacking nutrients",
  },
  richFoodsIn: { ja: "{name}が豊富な食材", en: "Foods Rich in {name}" },
  noMatchingFoods: { ja: "該当する食材がありません", en: "No matching foods" },
  suggestedRecipes: { ja: "おすすめレシピ", en: "Suggested Recipes" },

  // Master Data
  masterDataTitle: { ja: "マスターデータ", en: "Master Data" },
  foodsTab: { ja: "食材", en: "Foods" },
  nutrientsTab: { ja: "栄養素", en: "Nutrients" },
  addFood: { ja: "食材を追加", en: "Add Food" },
  foodName: { ja: "食材名", en: "Food Name" },
  unitLabel: { ja: "単位", en: "Unit" },
  gramsPerUnit: { ja: "1単位あたりのg", en: "Grams per unit" },
  nutrientsPer100g: { ja: "栄養素（100gあたり）", en: "Nutrients (per 100g)" },
  addNutrientItem: { ja: "栄養素を追加", en: "Add Nutrient" },
  selectNutrient: { ja: "選択...", en: "Select..." },
  amountLabel: { ja: "量", en: "Amount" },
  enterFoodName: { ja: "食材名を入力してください", en: "Please enter a food name" },
  foodAdded: { ja: "食材を追加しました", en: "Food added" },
  foodUpdated: { ja: "食材を更新しました", en: "Food updated" },
  addNutrient: { ja: "栄養素を追加", en: "Add Nutrient" },
  nutrientName: { ja: "栄養素名", en: "Nutrient Name" },
  unitPlaceholder: { ja: "単位 (g, mg, kcal)", en: "Unit (g, mg, kcal)" },
  requiredNutrient: { ja: "必須栄養素", en: "Required nutrient" },
  nutrientAdded: { ja: "栄養素を追加しました", en: "Nutrient added" },

  // Language
  language: { ja: "言語", en: "Language" },
} as const;

export type TranslationKey = keyof typeof translations;
