import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  CategoriesDocument,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  type CategoriesQuery,
  type CategoryType,
} from "../generated/graphql";
import { createCategorySchema } from "../lib/validation";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type CategoryFormData = z.infer<ReturnType<typeof createCategorySchema>>;

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type?: CategoryType;
  categories: CategoriesQuery["categories"];
  editingCategory?:
    | CategoriesQuery["categories"][number]
    | NonNullable<CategoriesQuery["categories"][number]["children"]>[number]
    | null;
}

export const CategoryFormDialog = ({
  isOpen,
  onClose,
  type,
  categories,
  editingCategory,
}: CategoryFormDialogProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(createCategorySchema(t)),
    defaultValues: {
      name: "",
      type: type || "EXPENSE",
      parentId: "none",
    },
  });

  const [createCategory, { loading: isCreating }] = useCreateCategoryMutation({
    refetchQueries: [
      { query: CategoriesDocument, variables: { type: "EXPENSE" } },
      { query: CategoriesDocument, variables: { type: "INCOME" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      handleClose();
    },
  });

  const [updateCategory, { loading: isUpdating }] = useUpdateCategoryMutation({
    refetchQueries: [
      { query: CategoriesDocument, variables: { type: "EXPENSE" } },
      { query: CategoriesDocument, variables: { type: "INCOME" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      handleClose();
    },
  });

  const handleClose = () => {
    reset({
      name: "",
      type: type || "EXPENSE",
      parentId: "none",
    });
    onClose();
  };

  const onSubmit = async (data: CategoryFormData) => {
    const input = {
      name: data.name,
      type: data.type,
      parentId:
        data.parentId && data.parentId !== "none" ? data.parentId : null,
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

  const parentCategories = categories.filter((cat) => !cat.parentId);

  // Update form when editingCategory changes
  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        type: editingCategory.type,
        parentId: editingCategory.parentId || "none",
      });
    }
  }, [editingCategory, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCategory
              ? t("categories.editCategory")
              : t("categories.addCategory")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="categoryName">
              {t("categories.categoryName")}
            </FieldLabel>
            <Input
              id="categoryName"
              {...register("name")}
              placeholder={t("categories.categoryNamePlaceholder")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="type">{t("categories.type")}</FieldLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!!editingCategory}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                    <SelectItem value="EXPENSE">
                      {t("categories.expense")}
                    </SelectItem>
                    <SelectItem value="INCOME">
                      {t("categories.income")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="parentId">
              {t("categories.parentCategory")}
            </FieldLabel>
            <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="parentId" className="w-full">
                    <SelectValue placeholder={t("categories.noneTopLevel")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("categories.noneTopLevel")}
                    </SelectItem>
                    {parentCategories
                      .filter((cat) => cat.id !== editingCategory?.id)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldDescription>
              {t("categories.parentCategoryHint")}
            </FieldDescription>
          </Field>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isCreating || isUpdating}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isCreating || isUpdating}
            >
              {isCreating
                ? t("common.creating")
                : isUpdating
                  ? t("common.updating")
                  : editingCategory
                    ? t("common.update")
                    : t("common.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
