import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger className="w-35 h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t("language.english")}</SelectItem>
          <SelectItem value="vi">{t("language.vietnamese")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
