import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryInput, UpdateCategoryInput } from "./dto/category.input";
import type { CategoryType } from "@prisma/client";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, type?: CategoryType) {
    return this.prisma.category.findMany({
      where: {
        userId,
        ...(type && { type }),
      },
      include: {
        children: true,
        parent: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.category.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  async create(userId: string, createCategoryInput: CreateCategoryInput) {
    return this.prisma.category.create({
      data: {
        ...createCategoryInput,
        userId,
      },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: updateCategoryInput,
      include: {
        children: true,
        parent: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
