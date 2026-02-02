import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateAssetTypeInput,
  UpdateAssetTypeInput,
} from "./dto/asset-type.input";

@Injectable()
export class AssetTypeService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.assetType.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.assetType.findFirst({
      where: { id, userId },
    });
  }

  async create(userId: string, input: CreateAssetTypeInput) {
    return this.prisma.assetType.create({
      data: {
        ...input,
        userId,
      },
    });
  }

  async update(id: string, userId: string, input: UpdateAssetTypeInput) {
    return this.prisma.assetType.update({
      where: { id },
      data: input,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.assetType.delete({
      where: { id },
    });
  }
}
