import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { z } from "zod";
import type { AssetTypesQuery, AssetsQuery } from "../generated/graphql";
import { createAssetSchema } from "../lib/validation";
import { Button } from "./ui/button";
import { DatePicker } from "./ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

type AssetFormData = z.infer<ReturnType<typeof createAssetSchema>>;

interface AssetFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssetFormData) => void | Promise<void>;
  editingItem: AssetsQuery["assets"][number] | null;
  assetTypes: AssetTypesQuery["assetTypes"];
  onOpenAssetTypeModal: () => void;
  isLoading?: boolean;
}

export const AssetFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  assetTypes,
  onOpenAssetTypeModal,
  isLoading = false,
}: AssetFormDialogProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(createAssetSchema(t)),
    defaultValues: {
      assetTypeId: "",
      name: "",
      quantity: "",
      purchasePrice: "",
      currentSellPrice: "",
      purchaseDate: format(new Date(), "yyyy-MM-dd"),
      note: "",
    },
  });

  const handleClose = () => {
    reset({
      assetTypeId: "",
      name: "",
      quantity: "",
      purchasePrice: "",
      currentSellPrice: "",
      purchaseDate: format(new Date(), "yyyy-MM-dd"),
      note: "",
    });
    onClose();
  };

  const handleFormSubmit = async (data: AssetFormData) => {
    await onSubmit(data);
  };

  useEffect(() => {
    if (editingItem) {
      reset({
        assetTypeId: editingItem.assetTypeId,
        name: editingItem.name,
        quantity: editingItem.quantity.toString(),
        purchasePrice: editingItem.purchasePrice.toString(),
        currentSellPrice: editingItem.currentSellPrice.toString(),
        purchaseDate: format(parseISO(editingItem.purchaseDate), "yyyy-MM-dd"),
        note: editingItem.note || "",
      });
    } else {
      reset({
        assetTypeId: "",
        name: "",
        quantity: "",
        purchasePrice: "",
        currentSellPrice: "",
        purchaseDate: format(new Date(), "yyyy-MM-dd"),
        note: "",
      });
    }
  }, [editingItem, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? t("assets.editAsset") : t("assets.addAsset")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="assetTypeId">
                {t("assets.fields.assetType")}
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onOpenAssetTypeModal}
                className="h-auto p-1 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                {t("assets.quickCreateType")}
              </Button>
            </div>
            <Controller
              name="assetTypeId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("assets.fields.selectAssetType")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} ({type.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assetTypeId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.assetTypeId.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="name">{t("assets.fields.assetName")}</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder={t("assets.fields.assetNamePlaceholder")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="quantity">{t("assets.fields.quantity")}</Label>
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  id="quantity"
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                  thousandSeparator=","
                  allowNegative={false}
                  valueIsNumericString
                  customInput={Input}
                  placeholder="1"
                  inputMode="numeric"
                />
              )}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="purchasePrice">
              {t("assets.fields.purchasePrice")}
            </Label>
            <Controller
              name="purchasePrice"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  id="purchasePrice"
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
            {errors.purchasePrice && (
              <p className="mt-1 text-sm text-red-600">
                {errors.purchasePrice.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="currentSellPrice">
              {t("assets.fields.currentSellPrice")}
            </Label>
            <Controller
              name="currentSellPrice"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  id="currentSellPrice"
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
            {errors.currentSellPrice && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentSellPrice.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="purchaseDate">
              {t("assets.fields.purchaseDate")}
            </Label>
            <Controller
              name="purchaseDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value ? parseISO(field.value) : undefined}
                  onChange={(date) => {
                    field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                  }}
                  placeholder={t("assets.fields.selectDate")}
                />
              )}
            />
            {errors.purchaseDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.purchaseDate.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="note">{t("assets.fields.note")}</Label>
            <Textarea id="note" {...register("note")} rows={3} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading
                ? editingItem
                  ? t("common.updating")
                  : t("common.creating")
                : editingItem
                  ? t("common.update")
                  : t("common.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
