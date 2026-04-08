import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, History, Database, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const navItems: { to: string; icon: typeof Home; labelKey: TranslationKey }[] = [
  { to: "/", icon: Home, labelKey: "navHome" },
  { to: "/recipes", icon: BookOpen, labelKey: "navRecipes" },
  { to: "/history", icon: History, labelKey: "navHistory" },
  { to: "/discover", icon: UtensilsCrossed, labelKey: "navDiscover" },
  { to: "/master", icon: Database, labelKey: "navData" },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md safe-area-pb">
      <div className="flex items-center justify-around py-1">
        {navItems.map(({ to, icon: Icon, labelKey }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
