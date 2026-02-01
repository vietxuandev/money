import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { useSettings } from "../hooks/useSettings";
import { formatCurrency } from "../lib/currency";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { CategoryFormDialog } from "../components/CategoryFormDialog";
import { TransactionFormDialog } from "../components/TransactionFormDialog";
import { Pagination } from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
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

export const ExpensesPage = () => {
  const { t } = useTranslation();
  const { currency } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<
    PaginatedExpensesQuery["paginatedExpenses"]["items"][number] | null
  >(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } =
    usePagination();

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

  const onSubmit = async (data: {
    amount: string;
    date: string;
    categoryId: string;
    note?: string;
  }) => {
    const input = {
      amount: parseFloat(data.amount),
      date: data.date,
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
  };

  const categories = categoriesData?.categories || [];
  const expenses = expensesData?.paginatedExpenses.items || [];
  const pageInfo = expensesData?.paginatedExpenses.pageInfo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">
              {t("expenses.title")}
            </h2>
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="default">
            + {t("expenses.addExpense")}
          </Button>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("common.date")}
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("common.category")}
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("common.note")}
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("common.amount")}
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {format(parseISO(expense.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {expense.category.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {expense.note || "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-rose-600 text-right">
                    {formatCurrency(expense.amount, currency)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(expense)}
                      className="mr-2"
                    >
                      {t("common.edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-900 hover:bg-red-50"
                    >
                      {t("common.delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

      <TransactionFormDialog
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={onSubmit}
        editingItem={editingExpense}
        categories={categories}
        type="expense"
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
      />

      <CategoryFormDialog
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        type="EXPENSE"
        categories={categories}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirmId !== null}
        title={t("expenses.deleteExpense")}
        description={t("expenses.deleteConfirm")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
