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
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { DatePicker } from "../components/ui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
        <div className="flex justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">
              {t("incomes.title")}
            </h2>
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="default">
            + {t("incomes.addIncome")}
          </Button>
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
              {incomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {format(parseISO(income.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {income.category.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {income.note || "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600 text-right">
                    {formatCurrency(income.amount, currency)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(income)}
                      className="mr-2"
                    >
                      {t("common.edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(income.id)}
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

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingIncome ? t("incomes.editIncome") : t("incomes.addIncome")}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="amount">{t("incomes.fields.amount")}</Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    id="amount"
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.value);
                    }}
                    thousandSeparator=","
                    allowNegative={false}
                    valueIsNumericString
                    customInput={Input}
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
              <Label htmlFor="date">{t("incomes.fields.date")}</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? parseISO(field.value) : undefined}
                    onChange={(date) => {
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                    }}
                    placeholder="Select date"
                  />
                )}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="categoryId">{t("incomes.fields.category")}</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((cat) => !cat.parentId)
                        .flatMap((cat) => [
                          cat.children && cat.children.length > 0 ? (
                            <SelectItem
                              key={cat.id}
                              value={cat.id}
                              disabled
                              className="font-semibold"
                            >
                              {cat.name}
                            </SelectItem>
                          ) : (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ),
                          ...(cat.children?.map((child) => (
                            <SelectItem
                              key={child.id}
                              value={child.id}
                              className="pl-6"
                            >
                              {child.name}
                            </SelectItem>
                          )) || []),
                        ])}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="note">{t("incomes.fields.note")}</Label>
              <Textarea id="note" {...register("note")} rows={3} />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingIncome ? "Update" : "Create"}
              </Button>
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
