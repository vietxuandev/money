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
import { createLoginSchema } from "../lib/validation";

type LoginFormData = {
  username: string;
  password: string;
};

export const LoginPage = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const { login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      await login(data.username, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">
            {t("auth.login.title")}
          </CardTitle>
          <CardDescription className="text-base">
            {t("auth.login.subtitle")}
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
                {t("auth.login.username")}
              </FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder={t("auth.login.username")}
                {...register("username")}
                aria-invalid={errors.username ? "true" : "false"}
              />
              <FieldError errors={[errors.username]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">
                {t("auth.login.password")}
              </FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder={t("auth.login.password")}
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-semibold mt-2"
            >
              {loading ? t("auth.login.submitting") : t("auth.login.submit")}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("auth.login.noAccount")}{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-semibold"
            >
              {t("auth.login.signUpLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
