import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { NumericFormat } from "react-number-format";
import { useTranslation } from "react-i18next";
import { useSettings } from "../hooks/useSettings";
import { formatCurrency } from "../lib/currency";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { Pagination } from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  usePaginatedExpensesQuery,
  useCategoriesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  PaginatedExpensesDocument,
  CategoriesDocument,
  ReportStatisticsDocument,
  type PaginatedExpensesQuery,
} from "../generated/graphql";

const expenseSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: "Amount must be greater than 0" },
    ),
  date: z.string().min(1, "Date is required"),
  categoryId: z.string().min(1, "Category is required"),
  note: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export const ExpensesPage = () => {
  const { t } = useTranslation();
  const { currency } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<
    PaginatedExpensesQuery["paginatedExpenses"]["items"][number] | null
  >(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } =
    usePagination();

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
      note: "",
      categoryId: "",
    },
  });

  const { data: expensesData, loading } = usePaginatedExpensesQuery({
    variables: {
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
      },
    },
  });
  const { data: categoriesData } = useCategoriesQuery({
    variables: { type: "EXPENSE" },
  });

  const [createExpense] = useCreateExpenseMutation({
    refetchQueries: [
      {
        query: PaginatedExpensesDocument,
        variables: {
          pagination: { page: currentPage, limit: itemsPerPage },
        },
      },
      { query: CategoriesDocument, variables: { type: "EXPENSE" } },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeModal();
    },
  });

  const [updateExpense] = useUpdateExpenseMutation({
    refetchQueries: [
      {
        query: PaginatedExpensesDocument,
        variables: {
          pagination: { page: currentPage, limit: itemsPerPage },
        },
      },
      { query: CategoriesDocument, variables: { type: "EXPENSE" } },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeModal();
    },
  });

  const [deleteExpense] = useDeleteExpenseMutation({
    refetchQueries: [
      {
        query: PaginatedExpensesDocument,
        variables: {
          pagination: { page: currentPage, limit: itemsPerPage },
        },
      },
      { query: CategoriesDocument, variables: { type: "EXPENSE" } },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
  });

  const onSubmit = async (data: ExpenseFormData) => {
    const input = {
      amount: parseFloat(data.amount),
      date: data.date, // Send as YYYY-MM-DD string
      note: data.note || null,
      categoryId: data.categoryId,
    };

    if (editingExpense) {
      await updateExpense({
        variables: { id: editingExpense.id, input },
      });
    } else {
      await createExpense({
        variables: { input },
      });
    }
  };

  const handleEdit = (
    expense: PaginatedExpensesQuery["paginatedExpenses"]["items"][number],
  ) => {
    setEditingExpense(expense);
    reset({
      amount: expense.amount.toString(),
      date: format(parseISO(expense.date), "yyyy-MM-dd"),
      note: expense.note || "",
      categoryId: expense.categoryId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteExpense({ variables: { id: deleteConfirmId } });
      setDeleteConfirmId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
    reset({
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
      note: "",
      categoryId: "",
    });
  };

  const categories = categoriesData?.categories || [];
  const expenses = expensesData?.paginatedExpenses.items || [];
  const pageInfo = expensesData?.paginatedExpenses.pageInfo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">
              {t("expenses.title")}
            </h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition shadow-md"
          >
            + {t("expenses.addExpense")}
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            {t("expenses.loadingExpenses")}
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {t("expenses.noExpensesYet")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("common.date")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("common.category")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("common.note")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("common.amount")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("common.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-accent">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {format(parseISO(expense.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {expense.category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {expense.note || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-rose-600 text-right">
                      {formatCurrency(expense.amount, currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-primary hover:text-primary/80 mr-4"
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t("common.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pageInfo && (
          <div className="px-6 pb-6">
            <Pagination
              currentPage={pageInfo.page}
              totalPages={pageInfo.totalPages}
              hasNextPage={pageInfo.hasNextPage}
              hasPreviousPage={pageInfo.hasPreviousPage}
              totalItems={pageInfo.total}
              itemsPerPage={pageInfo.limit}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Amount
              </label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.value);
                    }}
                    thousandSeparator=","
                    allowNegative={false}
                    valueIsNumericString
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0"
                  />
                )}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date
              </label>
              <input
                type="date"
                {...register("date")}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <select
                {...register("categoryId")}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories
                  .filter((cat) => !cat.parentId)
                  .map((cat) => [
                    <option key={cat.id} value="" disabled>
                      {cat.name}
                    </option>,
                    ...(cat.children?.map((child) => (
                      <option key={child.id} value={child.id}>
                        &nbsp;&nbsp;- {child.name}
                      </option>
                    )) || []),
                  ])}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Note (Optional)
              </label>
              <textarea
                {...register("note")}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
              />
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
                {editingExpense ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={deleteConfirmId !== null}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
