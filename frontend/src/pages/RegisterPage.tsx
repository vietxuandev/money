import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { createRegisterSchema } from "../lib/validation";

type RegisterFormData = {
  username: string;
  password: string;
  confirmPassword: string;
};

export const RegisterPage = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const { register, loading } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    try {
      await register(data.username, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">
            {t("auth.register.title")}
          </CardTitle>
          <CardDescription className="text-base">
            {t("auth.register.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg text-sm font-medium border border-destructive/20">
                {error}
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="username">
                {t("auth.register.username")}
              </FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder={t("auth.register.username")}
                {...registerField("username")}
                aria-invalid={errors.username ? "true" : "false"}
              />
              <FieldError errors={[errors.username]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">
                {t("auth.register.password")}
              </FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder={t("auth.register.password")}
                {...registerField("password")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                {t("auth.register.confirmPassword")}
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t("auth.register.confirmPassword")}
                {...registerField("confirmPassword")}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
              />
              <FieldError errors={[errors.confirmPassword]} />
            </Field>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-semibold mt-2"
            >
              {loading
                ? t("auth.register.submitting")
                : t("auth.register.submit")}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("auth.register.hasAccount")}{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-semibold"
            >
              {t("auth.register.signInLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
