import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  useExpensesQuery,
  useCategoriesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  ExpensesDocument,
  ReportStatisticsDocument,
  type ExpensesQuery,
} from "../generated/graphql";

type ExpenseFormData = {
  amount: string;
  date: string;
  note: string;
  categoryId: string;
};

export const ExpensesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<
    ExpensesQuery["expenses"][number] | null
  >(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    defaultValues: {
      amount: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
      categoryId: "",
    },
  });

  const { data: expensesData, loading } = useExpensesQuery();
  const { data: categoriesData } = useCategoriesQuery({
    variables: { type: "EXPENSE" },
  });

  const [createExpense] = useCreateExpenseMutation({
    refetchQueries: [
      { query: ExpensesDocument },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeModal();
    },
  });

  const [updateExpense] = useUpdateExpenseMutation({
    refetchQueries: [
      { query: ExpensesDocument },
      { query: ReportStatisticsDocument, variables: { range: "MONTH" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeModal();
    },
  });

  const [deleteExpense] = useDeleteExpenseMutation({
    refetchQueries: [
      { query: ExpensesDocument },
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

  const handleEdit = (expense: ExpensesQuery["expenses"][number]) => {
    setEditingExpense(expense);
    reset({
      amount: expense.amount.toString(),
      date: new Date(expense.date).toISOString().split("T")[0],
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
      date: new Date().toISOString().split("T")[0],
      note: "",
      categoryId: "",
    });
  };

  const categories = categoriesData?.categories || [];
  const expenses = expensesData?.expenses || [];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
            <p className="text-gray-600 mt-1">
              Total:{" "}
              <NumericFormat
                value={totalExpenses}
                displayType="text"
                thousandSeparator=","
              />
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading expenses...
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No expenses yet. Add your first expense!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.category?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {expense.note || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-rose-600 text-right">
                      <NumericFormat
                        value={expense.amount}
                        displayType="text"
                        thousandSeparator=","
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: "Amount is required",
                  validate: (value) => {
                    const num = parseFloat(value);
                    if (isNaN(num) || num <= 0) {
                      return "Amount must be greater than 0";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <NumericFormat
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.value);
                    }}
                    thousandSeparator=","
                    allowNegative={false}
                    valueIsNumericString
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                {...register("date", {
                  required: "Date is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                {...register("categoryId", {
                  required: "Category is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (Optional)
              </label>
              <textarea
                {...register("note")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
              />
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
