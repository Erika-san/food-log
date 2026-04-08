import { useLanguage } from "@/i18n/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "ja" ? "en" : "ja")}
      className="flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      aria-label="Toggle language"
    >
      <Globe className="h-3.5 w-3.5" />
      {language === "ja" ? "EN" : "JP"}
    </button>
  );
}
