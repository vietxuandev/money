import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { Plus } from "lucide-react";
import { Fragment, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { z } from "zod";
import type { CategoriesQuery } from "../generated/graphql";
import { createTransactionSchema } from "../lib/validation";
import { Button } from "./ui/button";
import { DatePicker } from "./ui/date-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

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
  isLoading?: boolean;
}

export const TransactionFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  categories,
  type,
  onOpenCategoryModal,
  isLoading = false,
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

  useEffect(() => {
    if (editingItem) {
      reset({
        amount: editingItem.amount.toString(),
        date: format(parseISO(editingItem.date), "yyyy-MM-dd"),
        note: editingItem.note || "",
        categoryId: editingItem.categoryId,
      });
    }
  }, [editingItem, reset]);

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
          <DialogDescription>
            {editingItem
              ? t(`${translationKey}.editDescription`)
              : t(`${translationKey}.addDescription`)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} id="transaction-form">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="amount">
                {t(`${translationKey}.fields.amount`)}
              </FieldLabel>
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
                    inputMode="numeric"
                  />
                )}
              />
              <FieldError errors={[errors.amount]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="date">
                {t(`${translationKey}.fields.date`)}
              </FieldLabel>
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
              <FieldError errors={[errors.date]} />
            </Field>

            <Field>
              <FieldLabel
                htmlFor="categoryId"
                className="items-center justify-between"
              >
                {t(`${translationKey}.fields.category`)}
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={onOpenCategoryModal}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {t("categories.quickCreate")}
                </Button>
              </FieldLabel>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="categoryId" className="w-full">
                      <SelectValue
                        placeholder={t(
                          `${translationKey}.fields.selectCategory`,
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category, index) => (
                        <Fragment key={category.id}>
                          {category.children && category.children.length > 0 ? (
                            <SelectGroup>
                              <SelectLabel>{category.name}</SelectLabel>
                              {category.children.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ) : (
                            <SelectGroup>
                              <SelectItem value={category.id}>
                                {category.name}
                              </SelectItem>
                            </SelectGroup>
                          )}
                          {index < categories.length - 1 && <SelectSeparator />}
                        </Fragment>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.categoryId]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="note">
                {t(`${translationKey}.fields.note`)}
              </FieldLabel>
              <Textarea id="note" {...register("note")} rows={3} />
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              {t("common.cancel")}
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading} form="transaction-form">
            {isLoading
              ? editingItem
                ? t("common.updating")
                : t("common.creating")
              : editingItem
                ? t("common.update")
                : t("common.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
