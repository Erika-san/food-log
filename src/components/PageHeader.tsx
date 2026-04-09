import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "@/components/LanguageToggle";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  action?: React.ReactNode;
}

export default function PageHeader({ title, showBack, action }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md">
      {showBack && (
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="flex-1 text-lg font-bold">{title}</h1>
      <LanguageToggle />
      {action}
    </header>
  );
}
