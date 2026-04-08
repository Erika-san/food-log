import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/store/AppContext";
import BottomNav from "@/components/BottomNav";
import DashboardPage from "@/pages/DashboardPage";
import RecipeListPage from "@/pages/RecipeListPage";
import RecipeFormPage from "@/pages/RecipeFormPage";
import RecipeDetailPage from "@/pages/RecipeDetailPage";
import CookingHistoryPage from "@/pages/CookingHistoryPage";
import DiscoverPage from "@/pages/DiscoverPage";
import MasterDataPage from "@/pages/MasterDataPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/recipes" element={<RecipeListPage />} />
            <Route path="/recipes/new" element={<RecipeFormPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
            <Route path="/history" element={<CookingHistoryPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/master" element={<MasterDataPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
