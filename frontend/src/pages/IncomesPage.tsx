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
  usePaginatedIncomesQuery,
  useCategoriesQuery,
  useCreateIncomeMutation,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation,
  PaginatedIncomesDocument,
  CategoriesDocument,
  ReportStatisticsDocument,
  type PaginatedIncomesQuery,
} from "../generated/graphql";

const incomeSchema = z.object({
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

type IncomeFormData = z.infer<typeof incomeSchema>;

export const IncomesPage = () => {
  const { t } = useTranslation();
  const { currency } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<
    PaginatedIncomesQuery["paginatedIncomes"]["items"][number] | null
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
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
      note: "",
      categoryId: "",
    },
  });

  const { data: incomesData, loading } = usePaginatedIncomesQuery({
    variables: {
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
      },
    },
  });
  const { data: categoriesData } = useCategoriesQuery({
    variables: { type: "INCOME" },
  });

  const [createIncome] = useCreateIncomeMutation({
    refetchQueries: [
      {
        query: PaginatedIncomesDocument,
        variables: {
          pagination: { page: currentPage, limit: itemsPerPage },
        },
      },
      { query: CategoriesDocument, variables: { type: "INCOME" } },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeModal();
    },
  });

  const [updateIncome] = useUpdateIncomeMutation({
    refetchQueries: [
      {
        query: PaginatedIncomesDocument,
        variables: {
          pagination: { page: currentPage, limit: itemsPerPage },
        },
      },
      { query: CategoriesDocument, variables: { type: "INCOME" } },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeModal();
    },
  });

  const [deleteIncome] = useDeleteIncomeMutation({
    refetchQueries: [
      {
        query: PaginatedIncomesDocument,
        variables: {
          pagination: { page: currentPage, limit: itemsPerPage },
        },
      },
      { query: CategoriesDocument, variables: { type: "INCOME" } },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
  });

  const onSubmit = async (data: IncomeFormData) => {
    const input = {
      amount: parseFloat(data.amount),
      date: data.date, // Send as YYYY-MM-DD string
      note: data.note || null,
      categoryId: data.categoryId,
    };

    if (editingIncome) {
      await updateIncome({
        variables: { id: editingIncome.id, input },
      });
    } else {
      await createIncome({
        variables: { input },
      });
    }
  };

  const handleEdit = (
    income: PaginatedIncomesQuery["paginatedIncomes"]["items"][number],
  ) => {
    setEditingIncome(income);
    reset({
      amount: income.amount.toString(),
      date: format(parseISO(income.date), "yyyy-MM-dd"),
      note: income.note || "",
      categoryId: income.categoryId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteIncome({ variables: { id: deleteConfirmId } });
      setDeleteConfirmId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
    reset({
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
      note: "",
      categoryId: "",
    });
  };

  const categories = categoriesData?.categories || [];
  const incomes = incomesData?.paginatedIncomes.items || [];
  const pageInfo = incomesData?.paginatedIncomes.pageInfo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">
              {t("incomes.title")}
            </h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition shadow-md"
          >
            + {t("incomes.addIncome")}
          </button>
        </div>
      </div>

      {/* Incomes List */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            {t("incomes.loadingIncomes")}
          </div>
        ) : incomes.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {t("incomes.noIncomesYet")}
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
                {incomes.map((income) => (
                  <tr key={income.id} className="hover:bg-accent">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {format(parseISO(income.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {income.category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {income.note || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600 text-right">
                      {formatCurrency(income.amount, currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(income)}
                        className="text-primary hover:text-primary/80 mr-4"
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        onClick={() => handleDelete(income.id)}
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
              {editingIncome ? "Edit Income" : "Add New Income"}
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
                {editingIncome ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={deleteConfirmId !== null}
        title="Delete Income"
        description="Are you sure you want to delete this income? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
