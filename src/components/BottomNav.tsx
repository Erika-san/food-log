import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, History, Database, UtensilsCrossed } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "ホーム" },
  { to: "/recipes", icon: BookOpen, label: "レシピ" },
  { to: "/history", icon: History, label: "履歴" },
  { to: "/discover", icon: UtensilsCrossed, label: "発見" },
  { to: "/master", icon: Database, label: "データ" },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md safe-area-pb">
      <div className="flex items-center justify-around py-1">
        {navItems.map(({ to, icon: Icon, label }) => {
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
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
