import { zodResolver } from "@hookform/resolvers/zod";
import {
  DollarSign,
  Moon,
  Sun,
  Tags,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import type { Currency, Theme } from "../generated/graphql";
import {
  CategoriesDocument,
  ReportStatisticsDocument,
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  type CategoriesQuery,
  type CategoryType,
} from "../generated/graphql";
import { useSettings } from "../hooks/useSettings";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  type: z.enum(["EXPENSE", "INCOME"]),
  parentId: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme, language, currency, isLoading, updateSettings } =
    useSettings();

  // Category management state
  const [categoryType, setCategoryType] = useState<CategoryType>("EXPENSE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    | CategoriesQuery["categories"][number]
    | NonNullable<CategoriesQuery["categories"][number]["children"]>[number]
    | null
  >(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit: handleCategorySubmit,
    reset: resetForm,
    formState: { errors: categoryErrors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
      parentId: "",
    },
  });

  const { data: categoriesData, loading: categoriesLoading } =
    useCategoriesQuery({
      variables: { type: categoryType },
    });

  const [createCategory] = useCreateCategoryMutation({
    refetchQueries: [
      { query: CategoriesDocument, variables: { type: "EXPENSE" } },
      { query: CategoriesDocument, variables: { type: "INCOME" } },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeModal();
    },
  });

  const [updateCategory] = useUpdateCategoryMutation({
    refetchQueries: [
      { query: CategoriesDocument, variables: { type: "EXPENSE" } },
      { query: CategoriesDocument, variables: { type: "INCOME" } },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeModal();
    },
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
  const onCategorySubmit = async (data: CategoryFormData) => {
    const input = {
      name: data.name,
      type: data.type,
      parentId: data.parentId || null,
    };

    if (editingCategory) {
      await updateCategory({
        variables: { id: editingCategory.id, input },
      });
    } else {
      await createCategory({
        variables: { input },
      });
    }
  };

  const handleEdit = (
    category:
      | CategoriesQuery["categories"][number]
      | NonNullable<CategoriesQuery["categories"][number]["children"]>[number],
  ) => {
    setEditingCategory(category);
    resetForm({
      name: category.name,
      type: category.type,
      parentId: category.parentId || "",
    });
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
    resetForm({
      name: "",
      type: categoryType,
      parentId: "",
    });
  };

  const categories = categoriesData?.categories || [];
  const parentCategories = categories.filter((cat) => !cat.parentId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    );
  }

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
                <SelectItem value="en">{t("language.english")}</SelectItem>
                <SelectItem value="vi">{t("language.vietnamese")}</SelectItem>
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
                  resetForm({ type: categoryType });
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
                {parentCategories.map((parent) => (
                  <div
                    key={parent.id}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    {/* Parent Category */}
                    <div className="bg-muted px-4 py-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {parent.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {parent.children?.length || 0}{" "}
                          {t("common.subcategories")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(parent)}
                        >
                          {t("common.edit")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(parent.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {t("common.delete")}
                        </Button>
                      </div>
                    </div>

                    {/* Child Categories */}
                    {parent.children && parent.children.length > 0 && (
                      <div className="bg-card divide-y divide-border">
                        {parent.children.map((child) => (
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

      {/* Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? t("categories.editCategory")
                : t("categories.addCategory")}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleCategorySubmit(onCategorySubmit)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">{t("categories.categoryName")}</Label>
              <input
                id="name"
                type="text"
                {...registerField("name")}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mt-1"
                placeholder={t("categories.categoryNamePlaceholder")}
              />
              {categoryErrors.name && (
                <span className="text-destructive text-sm">
                  {categoryErrors.name.message}
                </span>
              )}
            </div>

            <div>
              <Label htmlFor="type">{t("categories.type")}</Label>
              <select
                id="type"
                {...registerField("type")}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mt-1"
                disabled={!!editingCategory}
              >
                <option value="EXPENSE">{t("categories.expense")}</option>
                <option value="INCOME">{t("categories.income")}</option>
              </select>
            </div>

            <div>
              <Label htmlFor="parentId">{t("categories.parentCategory")}</Label>
              <select
                id="parentId"
                {...registerField("parentId")}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mt-1"
              >
                <option value="">{t("categories.noneTopLevel")}</option>
                {parentCategories
                  .filter((cat) => cat.id !== editingCategory?.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {t("categories.parentCategoryHint")}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1"
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" className="flex-1">
                {editingCategory ? t("common.update") : t("common.create")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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

export default SettingsPage;
