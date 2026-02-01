import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { NumericFormat } from "react-number-format";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { createTransactionSchema } from "../lib/validation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { DatePicker } from "./ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import type { CategoriesQuery } from "../generated/graphql";

type TransactionFormData = z.infer<ReturnType<typeof createTransactionSchema>>;

interface TransactionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void | Promise<void>;
  editingItem: {
    amount: number;
    date: string;
    note: string | null;
    categoryId: string;
  } | null;
  categories: CategoriesQuery["categories"];
  type: "expense" | "income";
  onOpenCategoryModal: () => void;
}

export const TransactionFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  categories,
  type,
  onOpenCategoryModal,
}: TransactionFormDialogProps) => {
  const { t } = useTranslation();
  const translationKey = type === "expense" ? "expenses" : "incomes";

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(createTransactionSchema(t)),
    defaultValues: {
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
      note: "",
      categoryId: "",
    },
  });

  const handleClose = () => {
    reset({
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
      note: "",
      categoryId: "",
    });
    onClose();
  };

  const handleFormSubmit = async (data: TransactionFormData) => {
    await onSubmit(data);
  };

  // Update form when editingItem changes
  if (editingItem && isOpen) {
    reset({
      amount: editingItem.amount.toString(),
      date: format(parseISO(editingItem.date), "yyyy-MM-dd"),
      note: editingItem.note || "",
      categoryId: editingItem.categoryId,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingItem
              ? t(
                  `${translationKey}.edit${type === "expense" ? "Expense" : "Income"}`,
                )
              : t(
                  `${translationKey}.add${type === "expense" ? "Expense" : "Income"}`,
                )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="amount">
              {t(`${translationKey}.fields.amount`)}
            </Label>
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
            <Label htmlFor="date">{t(`${translationKey}.fields.date`)}</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value ? parseISO(field.value) : undefined}
                  onChange={(date) => {
                    field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                  }}
                  placeholder={t(`${translationKey}.fields.selectDate`)}
                />
              )}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="categoryId">
                {t(`${translationKey}.fields.category`)}
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onOpenCategoryModal}
                className="h-auto p-1 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                {t("categories.quickCreate")}
              </Button>
            </div>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t(`${translationKey}.fields.selectCategory`)}
                    />
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
            <Label htmlFor="note">{t(`${translationKey}.fields.note`)}</Label>
            <Textarea id="note" {...register("note")} rows={3} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" className="flex-1">
              {editingItem ? t("common.update") : t("common.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
