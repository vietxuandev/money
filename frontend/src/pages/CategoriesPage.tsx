import { useState } from "react";
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

export const CategoriesPage = () => {
  const [categoryType, setCategoryType] = useState<CategoryType>("EXPENSE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    | CategoriesQuery["categories"][number]
    | NonNullable<CategoriesQuery["categories"][number]["children"]>[number]
    | null
  >(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE" as CategoryType,
    parentId: "",
  });

  const { data, loading } = useCategoriesQuery({
    variables: { type: categoryType },
  });

  const [createCategory] = useCreateCategoryMutation({
    refetchQueries: [
      { query: CategoriesDocument },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeModal();
    },
  });

  const [updateCategory] = useUpdateCategoryMutation({
    refetchQueries: [
      { query: CategoriesDocument },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeModal();
    },
  });

  const [deleteCategory] = useDeleteCategoryMutation({
    refetchQueries: [
      { query: CategoriesDocument },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      name: formData.name,
      type: formData.type,
      parentId: formData.parentId || null,
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
    setFormData({
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
    setFormData({
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
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
            <p className="text-gray-600 mt-1">Manage your category hierarchy</p>
          </div>
          <button
            onClick={() => {
              setFormData({ ...formData, type: categoryType });
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
          >
            + Add Category
          </button>
        </div>

        {/* Type Selector */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setCategoryType("EXPENSE")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              categoryType === "EXPENSE"
                ? "bg-rose-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            💸 Expenses
          </button>
          <button
            onClick={() => setCategoryType("INCOME")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              categoryType === "INCOME"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            💰 Incomes
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {loading ? (
          <div className="text-center text-gray-500 py-8">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No categories yet. Add your first category!
          </div>
        ) : (
          <div className="space-y-4">
            {parentCategories.map((parent) => (
              <div
                key={parent.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Parent Category */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {parent.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {parent.children?.length || 0} subcategories
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(parent)}
                      className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(parent.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Child Categories */}
                {parent.children && parent.children.length > 0 && (
                  <div className="bg-white divide-y divide-gray-200">
                    {parent.children.map((child) => (
                      <div
                        key={child.id}
                        className="px-6 py-3 flex justify-between items-center hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400">└─</span>
                          <span className="text-gray-900">{child.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(child)}
                            className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(child.id)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-900 font-medium"
                          >
                            Delete
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Food, Salary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as CategoryType,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={!!editingCategory}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Category (Optional)
              </label>
              <select
                value={formData.parentId}
                onChange={(e) =>
                  setFormData({ ...formData, parentId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              <p className="text-xs text-gray-500 mt-1">
                Select a parent to create a subcategory
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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
