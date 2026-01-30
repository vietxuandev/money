import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  CategoriesDocument,
  ReportStatisticsDocument,
  type CategoriesQuery,
} from "../generated/graphql";
import type { CategoryType } from "../generated/graphql";

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

export const CategoriesPage = () => {
  const { t } = useTranslation();
  const [categoryType, setCategoryType] = useState<CategoryType>("EXPENSE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    | CategoriesQuery["categories"][number]
    | NonNullable<CategoriesQuery["categories"][number]["children"]>[number]
    | null
  >(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
      parentId: "",
    },
  });

  const { data, loading } = useCategoriesQuery({
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

  const onSubmit = async (data: CategoryFormData) => {
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
    reset({
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
    reset({
      name: "",
      type: categoryType,
      parentId: "",
    });
  };

  const categories = data?.categories || [];
  const parentCategories = categories.filter((cat) => !cat.parentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">
              {t("categories.title")}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t("common.manageCategoryHierarchy")}
            </p>
          </div>
          <button
            onClick={() => {
              reset({ type: categoryType });
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition shadow-md"
          >
            + {t("categories.addCategory")}
          </button>
        </div>

        {/* Type Selector */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setCategoryType("EXPENSE")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              categoryType === "EXPENSE"
                ? "bg-rose-600 text-white shadow-md"
                : "bg-accent text-foreground hover:bg-accent/80"
            }`}
          >
            💸 {t("categories.expenseCategories")}
          </button>
          <button
            onClick={() => setCategoryType("INCOME")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              categoryType === "INCOME"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-accent text-foreground hover:bg-accent/80"
            }`}
          >
            💰 {t("categories.incomeCategories")}
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        {loading ? (
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
                <div className="bg-muted px-6 py-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {parent.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {parent.children?.length || 0} {t("common.subcategories")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(parent)}
                      className="px-3 py-1 text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(parent.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-900 font-medium"
                    >
                      {t("common.delete")}
                    </button>
                  </div>
                </div>

                {/* Child Categories */}
                {parent.children && parent.children.length > 0 && (
                  <div className="bg-card divide-y divide-border">
                    {parent.children.map((child) => (
                      <div
                        key={child.id}
                        className="px-6 py-3 flex justify-between items-center hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">└─</span>
                          <span className="text-foreground">{child.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(child)}
                            className="px-3 py-1 text-sm text-primary hover:text-primary/80 font-medium"
                          >
                            {t("common.edit")}
                          </button>
                          <button
                            onClick={() => handleDelete(child.id)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-900 font-medium"
                          >
                            {t("common.delete")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category Name
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Food, Salary"
              />
              {errors.name && (
                <span className="text-destructive text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Type
              </label>
              <select
                {...register("type")}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={!!editingCategory}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Parent Category (Optional)
              </label>
              <select
                {...register("parentId")}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">None (Top Level)</option>
                {parentCategories
                  .filter((cat) => cat.id !== editingCategory?.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Select a parent to create a subcategory
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-input text-foreground rounded-lg hover:bg-accent transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                {editingCategory ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={deleteConfirmId !== null}
        title="Delete Category"
        description="Are you sure you want to delete this category? All related records will be deleted. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
