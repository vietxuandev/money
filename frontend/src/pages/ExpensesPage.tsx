import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoryFormDialog } from "../components/CategoryFormDialog";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { Pagination } from "../components/Pagination";
import { TransactionFormDialog } from "../components/TransactionFormDialog";
import { TransactionTable } from "../components/TransactionTable";
import { Button } from "../components/ui/button";
import {
  CategoriesDocument,
  PaginatedExpensesDocument,
  ReportStatisticsDocument,
  useCategoriesQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  usePaginatedExpensesQuery,
  useUpdateExpenseMutation,
  type PaginatedExpensesQuery,
} from "../generated/graphql";
import { usePagination } from "../hooks/usePagination";

export const ExpensesPage = () => {
  const { t } = useTranslation();
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
    variables: { type: "EXPENSE", isParent: true },
  });

  const [createExpense, { loading: isCreatingExpense }] =
    useCreateExpenseMutation({
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

  const [updateExpense, { loading: isUpdatingExpense }] =
    useUpdateExpenseMutation({
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

  const [deleteExpense, { loading: isDeletingExpense }] =
    useDeleteExpenseMutation({
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
      {/* Expenses List */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t("expenses.title")}</h3>
            <Button onClick={() => setIsModalOpen(true)} size="default">
              + {t("expenses.addExpense")}
            </Button>
          </div>
        </div>
        <TransactionTable
          transactions={expenses}
          loading={loading}
          type="expense"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

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
        isLoading={isCreatingExpense || isUpdatingExpense}
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
        isLoading={isDeletingExpense}
      />
    </div>
  );
};
