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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
    } else {
      reset({
        name: "",
        unit: "",
        description: "",
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingAssetType
              ? t("assets.editAssetType")
              : t("assets.addAssetType")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="assetTypeName">
              {t("assets.fields.assetTypeName")}
            </Label>
            <Input
              id="assetTypeName"
              {...register("name")}
              placeholder={t("assets.fields.assetTypeNamePlaceholder")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="unit">{t("assets.fields.unit")}</Label>
            <Input
              id="unit"
              {...register("unit")}
              placeholder={t("assets.fields.unitPlaceholder")}
            />
            {errors.unit && (
              <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">
              {t("assets.fields.description")}
            </Label>
            <Textarea id="description" {...register("description")} rows={3} />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

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
                  : editingAssetType
                    ? t("common.update")
                    : t("common.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
