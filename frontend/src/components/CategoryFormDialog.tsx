import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { createCategorySchema } from "../lib/validation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  CategoriesDocument,
  type CategoriesQuery,
  type CategoryType,
} from "../generated/graphql";

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

  // Update form when editingCategory changes
  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        type: editingCategory.type,
        parentId: editingCategory.parentId || "none",
      });
    } else if (type) {
      reset({
        name: "",
        type,
        parentId: "none",
      });
    }
  }, [editingCategory, type, reset]);

  const [createCategory] = useCreateCategoryMutation({
    refetchQueries: [
      { query: CategoriesDocument, variables: { type: "EXPENSE" } },
      { query: CategoriesDocument, variables: { type: "INCOME" } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      handleClose();
    },
  });

  const [updateCategory] = useUpdateCategoryMutation({
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
          <div>
            <Label htmlFor="categoryName">{t("categories.categoryName")}</Label>
            <Input
              id="categoryName"
              {...register("name")}
              placeholder={t("categories.categoryNamePlaceholder")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="type">{t("categories.type")}</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!!editingCategory}
                >
                  <SelectTrigger className="w-full">
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
          </div>

          <div>
            <Label htmlFor="parentId">{t("categories.parentCategory")}</Label>
            <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
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
            <p className="text-xs text-muted-foreground mt-1">
              {t("categories.parentCategoryHint")}
            </p>
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
              {editingCategory ? t("common.update") : t("common.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
