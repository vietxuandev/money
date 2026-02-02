import { z } from "zod";

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    username: z
      .string()
      .min(1, t("auth.errors.usernameRequired"))
      .min(3, t("auth.errors.usernameMinLength")),
    password: z
      .string()
      .min(1, t("auth.errors.passwordRequired"))
      .min(6, t("auth.errors.passwordMinLength")),
  });

export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      username: z
        .string()
        .min(1, t("auth.errors.usernameRequired"))
        .min(3, t("auth.errors.usernameMinLength")),
      password: z
        .string()
        .min(1, t("auth.errors.passwordRequired"))
        .min(6, t("auth.errors.passwordMinLength")),
      confirmPassword: z
        .string()
        .min(1, t("auth.errors.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.errors.passwordMismatch"),
      path: ["confirmPassword"],
    });

export const createTransactionSchema = (t: (key: string) => string) =>
  z.object({
    amount: z
      .string()
      .min(1, t("validation.amountRequired"))
      .refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num > 0;
        },
        { message: t("validation.amountGreaterThanZero") },
      ),
    date: z.string().min(1, t("validation.dateRequired")),
    categoryId: z.string().min(1, t("validation.categoryRequired")),
    note: z.string().optional(),
  });

export const createCategorySchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t("validation.categoryNameRequired"))
      .min(2, t("validation.categoryNameMinLength"))
      .max(50, t("validation.categoryNameMaxLength")),
    type: z.enum(["EXPENSE", "INCOME"]),
    parentId: z.string().optional(),
  });

export const createAssetTypeSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t("validation.assetTypeNameRequired"))
      .min(2, t("validation.assetTypeNameMinLength"))
      .max(50, t("validation.assetTypeNameMaxLength")),
    unit: z
      .string()
      .min(1, t("validation.unitRequired"))
      .max(20, t("validation.unitMaxLength")),
    description: z.string().optional(),
  });

export const createAssetSchema = (t: (key: string) => string) =>
  z.object({
    assetTypeId: z.string().min(1, t("validation.assetTypeRequired")),
    name: z
      .string()
      .min(1, t("validation.assetNameRequired"))
      .min(2, t("validation.assetNameMinLength"))
      .max(100, t("validation.assetNameMaxLength")),
    quantity: z
      .string()
      .min(1, t("validation.quantityRequired"))
      .refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num > 0;
        },
        { message: t("validation.quantityGreaterThanZero") },
      ),
    purchasePrice: z.string().optional(),
    currentSellPrice: z.string().optional(),
    purchaseDate: z.string().min(1, t("validation.dateRequired")),
    note: z.string().optional(),
  });
