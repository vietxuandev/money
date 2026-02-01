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
