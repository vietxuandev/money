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
  PaginatedIncomesDocument,
  ReportStatisticsDocument,
  useCategoriesQuery,
  useCreateIncomeMutation,
  useDeleteIncomeMutation,
  usePaginatedIncomesQuery,
  useUpdateIncomeMutation,
  type PaginatedIncomesQuery,
} from "../generated/graphql";
import { usePagination } from "../hooks/usePagination";

export const IncomesPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<
    PaginatedIncomesQuery["paginatedIncomes"]["items"][number] | null
  >(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } =
    usePagination();

  const { data: incomesData, loading } = usePaginatedIncomesQuery({
    variables: {
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
      },
    },
  });
  const { data: categoriesData } = useCategoriesQuery({
    variables: { type: "INCOME", isParent: true },
  });

  const [createIncome, { loading: isCreatingIncome }] = useCreateIncomeMutation(
    {
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
    },
  );

  const [updateIncome, { loading: isUpdatingIncome }] = useUpdateIncomeMutation(
    {
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
    },
  );

  const [deleteIncome, { loading: isDeletingIncome }] = useDeleteIncomeMutation(
    {
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
    },
  );

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
  };

  const categories = categoriesData?.categories || [];
  const incomes = incomesData?.paginatedIncomes.items || [];
  const pageInfo = incomesData?.paginatedIncomes.pageInfo;

  return (
    <div className="space-y-6">
      {/* Incomes List */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t("incomes.title")}</h3>
            <Button onClick={() => setIsModalOpen(true)} size="default">
              + {t("incomes.addIncome")}
            </Button>
          </div>
        </div>
        <TransactionTable
          transactions={incomes}
          loading={loading}
          type="income"
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
        editingItem={editingIncome}
        categories={categories}
        type="income"
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        isLoading={isCreatingIncome || isUpdatingIncome}
      />

      <CategoryFormDialog
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        type="INCOME"
        categories={categories}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirmId !== null}
        title={t("incomes.deleteIncome")}
        description={t("incomes.deleteConfirm")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
        isLoading={isDeletingIncome}
      />
    </div>
  );
};
