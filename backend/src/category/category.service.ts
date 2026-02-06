import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryInput, UpdateCategoryInput } from "./dto/category.input";
import type { CategoryType } from "@prisma/client";
import { PaginationInput } from "../common/dto/pagination.input";
import { PageInfo } from "../common/models/pagination.model";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll({
    userId,
    type,
    pagination,
    isParent,
  }: {
    userId: string;
    type?: CategoryType;
    pagination?: PaginationInput;
    isParent?: boolean;
  }) {
    const where = {
      userId,
      ...(type && { type }),
      ...(isParent && { parentId: null }),
    };

    // If no pagination provided, return all items (backward compatibility)
    if (!pagination) {
      return this.prisma.category.findMany({
        where,
        include: {
          children: true,
          parent: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    }

    // Pagination logic
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        include: {
          children: true,
          parent: true,
        },
        orderBy: {
          name: "asc",
        },
        skip,
        take: limit,
      }),
      this.prisma.category.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const pageInfo: PageInfo = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return { items, pageInfo };
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
    _userId: string,
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

  async remove(id: string, _userId: string) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
