import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import {
  DollarSign,
  Moon,
  Sun,
  Tags,
  TrendingDown,
  TrendingUp,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoryFormDialog } from "../components/CategoryFormDialog";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import type { Currency, Theme } from "../generated/graphql";
import {
  CategoriesDocument,
  ReportStatisticsDocument,
  useCategoriesQuery,
  useDeleteCategoryMutation,
  type CategoriesQuery,
  type CategoryType,
} from "../generated/graphql";

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, language, currency, updateSettings } = useSettings();

  // Category management state
  const [categoryType, setCategoryType] = useState<CategoryType>("EXPENSE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    | CategoriesQuery["categories"][number]
    | NonNullable<CategoriesQuery["categories"][number]["children"]>[number]
    | null
  >(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: categoriesData, loading: categoriesLoading } =
    useCategoriesQuery({
      variables: { type: categoryType, isParent: true },
    });

  const [deleteCategory] = useDeleteCategoryMutation({
    refetchQueries: [
      { query: CategoriesDocument, variables: { type: "EXPENSE" } },
      { query: CategoriesDocument, variables: { type: "INCOME" } },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
  });

  const handleThemeChange = async (newTheme: Theme) => {
    await updateSettings({ theme: newTheme });
  };

  const handleLanguageChange = async (newLanguage: string) => {
    await updateSettings({ language: newLanguage });
  };

  const handleCurrencyChange = async (newCurrency: Currency) => {
    await updateSettings({ currency: newCurrency });
  };

  // Category management handlers
  const handleEdit = (
    category:
      | CategoriesQuery["categories"][number]
      | NonNullable<CategoriesQuery["categories"][number]["children"]>[number],
  ) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteCategory({ variables: { id: deleteConfirmId } });
      setDeleteConfirmId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const categories = categoriesData?.categories || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("settings.description")}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.theme.title")}</CardTitle>
            <CardDescription>{t("settings.theme.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={theme === "LIGHT" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleThemeChange("LIGHT")}
              >
                <Sun className="mr-2 h-4 w-4" />
                {t("settings.theme.light")}
              </Button>
              <Button
                variant={theme === "DARK" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleThemeChange("DARK")}
              >
                <Moon className="mr-2 h-4 w-4" />
                {t("settings.theme.dark")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.language.title")}</CardTitle>
            <CardDescription>
              {t("settings.language.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en">{t("language.english")}</SelectItem>
                  <SelectItem value="vi">{t("language.vietnamese")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.currency.title")}</CardTitle>
            <CardDescription>
              {t("settings.currency.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={currency}
              onValueChange={(value: string) =>
                handleCurrencyChange(value as Currency)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="USD" id="usd" />
                <Label
                  htmlFor="usd"
                  className="flex items-center cursor-pointer"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  {t("settings.currency.usd")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="VND" id="vnd" />
                <Label
                  htmlFor="vnd"
                  className="flex items-center cursor-pointer"
                >
                  <span className="mr-2">₫</span>
                  {t("settings.currency.vnd")}
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Categories Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  {t("categories.title")}
                </CardTitle>
                <CardDescription>
                  {t("common.manageCategoryHierarchy")}
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setEditingCategory(null);
                  setIsModalOpen(true);
                }}
                size="sm"
              >
                + {t("categories.addCategory")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Type Selector */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={categoryType === "EXPENSE" ? "default" : "outline"}
                onClick={() => setCategoryType("EXPENSE")}
                className="flex-1"
              >
                <TrendingDown /> {t("categories.expenseCategories")}
              </Button>
              <Button
                variant={categoryType === "INCOME" ? "default" : "outline"}
                onClick={() => setCategoryType("INCOME")}
                className="flex-1"
              >
                <TrendingUp /> {t("categories.incomeCategories")}
              </Button>
            </div>

            {/* Categories List */}
            {categoriesLoading ? (
              <div className="text-center text-muted-foreground py-8">
                {t("common.loadingCategories")}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {t("common.noCategoriesYet")}
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    <div className="bg-muted px-4 py-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {category.children?.length || 0}{" "}
                          {t("common.subcategories")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          {t("common.edit")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {t("common.delete")}
                        </Button>
                      </div>
                    </div>

                    {category.children && category.children.length > 0 && (
                      <div className="bg-card divide-y divide-border">
                        {category.children.map((child) => (
                          <div
                            key={child.id}
                            className="px-4 py-2 flex justify-between items-center hover:bg-accent"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-sm">
                                └─
                              </span>
                              <span className="text-foreground text-sm">
                                {child.name}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(child)}
                              >
                                {t("common.edit")}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(child.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                {t("common.delete")}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.account.title")}</CardTitle>
          <CardDescription>{t("settings.account.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex flex-col gap-1">
                <p className="font-medium">
                  {t("settings.account.loggedInAs")}
                </p>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {user?.username}
                  </p>
                </div>
              </div>
            </div>
            <Button variant="destructive" className="w-full" onClick={logout}>
              {t("common.logout")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <CategoryFormDialog
        isOpen={isModalOpen}
        onClose={closeModal}
        type={categoryType}
        categories={categories}
        editingCategory={editingCategory}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirmId !== null}
        title={t("categories.deleteCategory")}
        description={t("categories.deleteConfirmation")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
