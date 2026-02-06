import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  AssetTypesDocument,
  useCreateAssetTypeMutation,
  useUpdateAssetTypeMutation,
  type AssetTypesQuery,
} from "../generated/graphql";
import { createAssetTypeSchema } from "../lib/validation";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type AssetTypeFormData = z.infer<ReturnType<typeof createAssetTypeSchema>>;

interface AssetTypeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingAssetType?: AssetTypesQuery["assetTypes"][number] | null;
}

export const AssetTypeFormDialog = ({
  isOpen,
  onClose,
  editingAssetType,
}: AssetTypeFormDialogProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssetTypeFormData>({
    resolver: zodResolver(createAssetTypeSchema(t)),
    defaultValues: {
      name: "",
      unit: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editingAssetType) {
      reset({
        name: editingAssetType.name,
        unit: editingAssetType.unit,
        description: editingAssetType.description || "",
      });
    }
  }, [editingAssetType, reset]);

  const [createAssetType, { loading: isCreating }] = useCreateAssetTypeMutation(
    {
      refetchQueries: [{ query: AssetTypesDocument }],
      awaitRefetchQueries: true,
      onCompleted: () => {
        handleClose();
      },
    },
  );

  const [updateAssetType, { loading: isUpdating }] = useUpdateAssetTypeMutation(
    {
      refetchQueries: [{ query: AssetTypesDocument }],
      awaitRefetchQueries: true,
      onCompleted: () => {
        handleClose();
      },
    },
  );

  const handleClose = () => {
    reset({
      name: "",
      unit: "",
      description: "",
    });
    onClose();
  };

  const onSubmit = async (data: AssetTypeFormData) => {
    const input = {
      name: data.name,
      unit: data.unit,
      description: data.description || null,
    };

    if (editingAssetType) {
      await updateAssetType({
        variables: { id: editingAssetType.id, input },
      });
    } else {
      await createAssetType({
        variables: { input },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAssetType
                ? t("assets.editAssetType")
                : t("assets.addAssetType")}
            </DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="assetTypeName">
                {t("assets.fields.assetTypeName")}
              </FieldLabel>
              <Input
                id="assetTypeName"
                {...register("name")}
                placeholder={t("assets.fields.assetTypeNamePlaceholder")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="unit">{t("assets.fields.unit")}</FieldLabel>
              <Input
                id="unit"
                {...register("unit")}
                placeholder={t("assets.fields.unitPlaceholder")}
              />
              <FieldError errors={[errors.unit]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">
                {t("assets.fields.description")}
              </FieldLabel>
              <Textarea
                id="description"
                {...register("description")}
                rows={3}
              />
              <FieldError errors={[errors.description]} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isCreating || isUpdating}
              >
                {t("common.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating
                ? t("common.creating")
                : isUpdating
                  ? t("common.updating")
                  : editingAssetType
                    ? t("common.update")
                    : t("common.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
