import { format, parseISO } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AssetFormDialog } from "../components/AssetFormDialog";
import { AssetTypeFormDialog } from "../components/AssetTypeFormDialog";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  AssetsDocument,
  AssetTypesDocument,
  OverallTotalValueDocument,
  useAssetsQuery,
  useAssetTypesQuery,
  useCreateAssetMutation,
  useDeleteAssetMutation,
  useDeleteAssetTypeMutation,
  useUpdateAssetMutation,
  type AssetsQuery,
  type AssetTypesQuery,
} from "../generated/graphql";

export const AssetsPage = () => {
  const { t } = useTranslation();
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isAssetTypeModalOpen, setIsAssetTypeModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<
    AssetsQuery["assets"][number] | null
  >(null);
  const [editingAssetType, setEditingAssetType] = useState<
    AssetTypesQuery["assetTypes"][number] | null
  >(null);
  const [deleteConfirmAssetId, setDeleteConfirmAssetId] = useState<
    string | null
  >(null);
  const [deleteConfirmAssetTypeId, setDeleteConfirmAssetTypeId] = useState<
    string | null
  >(null);

  const { data: assetsData, loading: assetsLoading } = useAssetsQuery();
  const { data: assetTypesData, loading: assetTypesLoading } =
    useAssetTypesQuery();

  const [createAsset, { loading: isCreatingAsset }] = useCreateAssetMutation({
    refetchQueries: [
      { query: AssetsDocument },
      { query: OverallTotalValueDocument },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeAssetModal();
    },
  });

  const [updateAsset, { loading: isUpdatingAsset }] = useUpdateAssetMutation({
    refetchQueries: [
      { query: AssetsDocument },
      { query: OverallTotalValueDocument },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      closeAssetModal();
    },
  });

  const [deleteAsset, { loading: isDeletingAsset }] = useDeleteAssetMutation({
    refetchQueries: [
      { query: AssetsDocument },
      { query: OverallTotalValueDocument },
    ],
    awaitRefetchQueries: true,
  });

  const [deleteAssetType, { loading: isDeletingAssetType }] =
    useDeleteAssetTypeMutation({
      refetchQueries: [{ query: AssetTypesDocument }],
      awaitRefetchQueries: true,
    });

  const onSubmitAsset = async (data: {
    assetTypeId: string;
    name: string;
    quantity: string;
    purchasePrice?: string;
    currentSellPrice?: string;
    purchaseDate: string;
    note?: string;
  }) => {
    const input = {
      assetTypeId: data.assetTypeId,
      name: data.name,
      quantity: parseFloat(data.quantity),
      purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : null,
      currentSellPrice: data.currentSellPrice
        ? parseFloat(data.currentSellPrice)
        : null,
      purchaseDate: data.purchaseDate,
      note: data.note || null,
    };

    if (editingAsset) {
      await updateAsset({
        variables: { id: editingAsset.id, input },
      });
    } else {
      await createAsset({
        variables: { input },
      });
    }
  };

  const handleEditAsset = (asset: AssetsQuery["assets"][number]) => {
    setEditingAsset(asset);
    setIsAssetModalOpen(true);
  };

  const handleDeleteAsset = (id: string) => {
    setDeleteConfirmAssetId(id);
  };

  const handleConfirmDeleteAsset = async () => {
    if (deleteConfirmAssetId) {
      await deleteAsset({ variables: { id: deleteConfirmAssetId } });
      setDeleteConfirmAssetId(null);
    }
  };

  const handleEditAssetType = (
    assetType: AssetTypesQuery["assetTypes"][number],
  ) => {
    setEditingAssetType(assetType);
    setIsAssetTypeModalOpen(true);
  };

  const handleDeleteAssetType = (id: string) => {
    setDeleteConfirmAssetTypeId(id);
  };

  const handleConfirmDeleteAssetType = async () => {
    if (deleteConfirmAssetTypeId) {
      await deleteAssetType({ variables: { id: deleteConfirmAssetTypeId } });
      setDeleteConfirmAssetTypeId(null);
    }
  };

  const closeAssetModal = () => {
    setIsAssetModalOpen(false);
    setEditingAsset(null);
  };

  const closeAssetTypeModal = () => {
    setIsAssetTypeModalOpen(false);
    setEditingAssetType(null);
  };

  const assets = assetsData?.assets || [];
  const assetTypes = assetTypesData?.assetTypes || [];

  const totalAssetValue = assets.reduce(
    (sum, asset) => sum + asset.totalValue,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Asset Types List */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t("assets.assetTypes")}</h3>
            <Button
              onClick={() => {
                setEditingAssetType(null);
                setIsAssetTypeModalOpen(true);
              }}
              size="default"
            >
              + {t("assets.addAssetType")}
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("assets.fields.assetTypeName")}</TableHead>
              <TableHead>{t("assets.fields.unit")}</TableHead>
              <TableHead>{t("assets.fields.description")}</TableHead>
              <TableHead className="text-right">
                {t("common.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetTypesLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : assetTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  {t("assets.noAssetTypesYet")}
                </TableCell>
              </TableRow>
            ) : (
              assetTypes.map((assetType) => (
                <TableRow key={assetType.id}>
                  <TableCell className="font-medium">
                    {assetType.name}
                  </TableCell>
                  <TableCell>{assetType.unit}</TableCell>
                  <TableCell>{assetType.description || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAssetType(assetType)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAssetType(assetType.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Assets List */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{t("assets.myAssets")}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("assets.totalValue")}: {totalAssetValue.toLocaleString()}
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingAsset(null);
                setIsAssetModalOpen(true);
              }}
              size="default"
            >
              + {t("assets.addAsset")}
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("assets.fields.assetName")}</TableHead>
              <TableHead>{t("assets.fields.assetType")}</TableHead>
              <TableHead className="text-right">
                {t("assets.fields.quantity")}
              </TableHead>
              <TableHead className="text-right">
                {t("assets.fields.purchasePrice")}
              </TableHead>
              <TableHead className="text-right">
                {t("assets.fields.currentSellPrice")}
              </TableHead>
              <TableHead className="text-right">
                {t("assets.fields.totalValue")}
              </TableHead>
              <TableHead>{t("assets.fields.purchaseDate")}</TableHead>
              <TableHead className="text-right">
                {t("common.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetsLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {t("assets.noAssetsYet")}
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>
                    {asset.assetType?.name} ({asset.assetType?.unit})
                  </TableCell>
                  <TableCell className="text-right">
                    {asset.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {asset.purchasePrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {asset.currentSellPrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {asset.totalValue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {format(parseISO(asset.purchaseDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAsset(asset)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAsset(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AssetFormDialog
        isOpen={isAssetModalOpen}
        onClose={closeAssetModal}
        onSubmit={onSubmitAsset}
        editingItem={editingAsset}
        assetTypes={assetTypes}
        onOpenAssetTypeModal={() => {
          setEditingAssetType(null);
          setIsAssetTypeModalOpen(true);
        }}
        isLoading={isCreatingAsset || isUpdatingAsset}
      />

      <AssetTypeFormDialog
        isOpen={isAssetTypeModalOpen}
        onClose={closeAssetTypeModal}
        editingAssetType={editingAssetType}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirmAssetId !== null}
        title={t("assets.deleteAsset")}
        description={t("assets.deleteAssetConfirm")}
        onConfirm={handleConfirmDeleteAsset}
        onCancel={() => setDeleteConfirmAssetId(null)}
        isLoading={isDeletingAsset}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirmAssetTypeId !== null}
        title={t("assets.deleteAssetType")}
        description={t("assets.deleteAssetTypeConfirm")}
        onConfirm={handleConfirmDeleteAssetType}
        onCancel={() => setDeleteConfirmAssetTypeId(null)}
        isLoading={isDeletingAssetType}
      />
    </div>
  );
};
