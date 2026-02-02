import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAssetInput, UpdateAssetInput } from "./dto/asset.input";

@Injectable()
export class AssetService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const assets = await this.prisma.asset.findMany({
      where: { userId },
      include: { assetType: true },
      orderBy: { createdAt: "desc" },
    });

    return assets.map((asset) => ({
      ...asset,
      currentSellPrice: asset.currentSellPrice ?? asset.purchasePrice,
      totalValue:
        asset.quantity * (asset.currentSellPrice ?? asset.purchasePrice),
    }));
  }

  async findOne(id: string, userId: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, userId },
      include: { assetType: true },
    });

    if (asset) {
      return {
        ...asset,
        currentSellPrice: asset.currentSellPrice ?? asset.purchasePrice,
        totalValue:
          asset.quantity * (asset.currentSellPrice ?? asset.purchasePrice),
      };
    }

    return null;
  }

  async create(userId: string, input: CreateAssetInput) {
    const purchasePrice = input.purchasePrice ?? 1;
    const currentSellPrice = input.currentSellPrice ?? purchasePrice;

    const asset = await this.prisma.asset.create({
      data: {
        ...input,
        purchaseDate: new Date(input.purchaseDate),
        purchasePrice,
        currentSellPrice,
        userId,
      },
      include: { assetType: true },
    });

    return {
      ...asset,
      totalValue: asset.quantity * asset.currentSellPrice,
    };
  }

  async update(id: string, userId: string, input: UpdateAssetInput) {
    const asset = await this.prisma.asset.update({
      where: { id },
      data: {
        ...input,
        ...(input.purchaseDate && {
          purchaseDate: new Date(input.purchaseDate),
        }),
      },
      include: { assetType: true },
    });

    return {
      ...asset,
      currentSellPrice: asset.currentSellPrice ?? asset.purchasePrice,
      totalValue:
        asset.quantity * (asset.currentSellPrice ?? asset.purchasePrice),
    };
  }

  async remove(id: string, userId: string) {
    return this.prisma.asset.delete({
      where: { id },
    });
  }

  async getTotalAssetValue(userId: string): Promise<number> {
    const result = await this.prisma.$queryRaw<[{ total: bigint }]>`
      SELECT COALESCE(SUM(quantity * COALESCE("currentSellPrice", "purchasePrice")), 0) as total
      FROM assets
      WHERE "userId" = ${userId}
    `;

    return Number(result[0]?.total || 0);
  }
}
