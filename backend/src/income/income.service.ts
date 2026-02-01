import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateIncomeInput, UpdateIncomeInput } from "./dto/income.input";
import { PaginationInput } from "../common/dto/pagination.input";
import { IncomeSortInput, SortDirection } from "../common/dto/sort.input";
import { PageInfo } from "../common/models/pagination.model";

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    pagination?: PaginationInput,
    sort?: IncomeSortInput,
  ) {
    const where = {
      userId,
      ...(startDate &&
        endDate && {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }),
    };

    // Determine sort field and direction
    const sortBy = sort?.sortBy || "date";
    const sortDirection = sort?.sortDirection || SortDirection.DESC;

    // Build orderBy with primary sort and createdAt as tiebreaker (if not already sorting by createdAt)
    const orderBy: Record<string, SortDirection>[] = [
      {
        [sortBy]: sortDirection,
      },
    ];

    // Only add createdAt as secondary sort if not already the primary sort field
    if (sortBy !== "createdAt") {
      orderBy.push({
        createdAt: SortDirection.DESC,
      });
    }

    // If no pagination provided, return all items (backward compatibility)
    if (!pagination) {
      return this.prisma.income.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
      });
    }

    // Pagination logic
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.income.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.income.count({ where }),
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
    return this.prisma.income.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
      },
    });
  }

  async create(userId: string, createIncomeInput: CreateIncomeInput) {
    return this.prisma.income.create({
      data: {
        ...createIncomeInput,
        userId,
        date: new Date(createIncomeInput.date),
      },
      include: {
        category: true,
      },
    });
  }

  async update(
    id: string,
    _userId: string,
    updateIncomeInput: UpdateIncomeInput,
  ) {
    return this.prisma.income.update({
      where: {
        id,
      },
      data: {
        ...updateIncomeInput,
        ...(updateIncomeInput.date && {
          date: new Date(updateIncomeInput.date),
        }),
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string, _userId: string) {
    return this.prisma.income.delete({
      where: {
        id,
      },
    });
  }
}
