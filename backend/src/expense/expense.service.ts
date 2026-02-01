import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExpenseInput, UpdateExpenseInput } from "./dto/expense.input";
import { PaginationInput } from "../common/dto/pagination.input";
import { ExpenseSortInput, SortDirection } from "../common/dto/sort.input";
import { PageInfo } from "../common/models/pagination.model";

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    pagination?: PaginationInput,
    sort?: ExpenseSortInput,
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
      return this.prisma.expense.findMany({
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
      this.prisma.expense.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.expense.count({ where }),
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
    return this.prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
      },
    });
  }

  async create(userId: string, createExpenseInput: CreateExpenseInput) {
    return this.prisma.expense.create({
      data: {
        ...createExpenseInput,
        userId,
        date: new Date(createExpenseInput.date),
      },
      include: {
        category: true,
      },
    });
  }

  async update(
    id: string,
    _userId: string,
    updateExpenseInput: UpdateExpenseInput,
  ) {
    return this.prisma.expense.update({
      where: {
        id,
      },
      data: {
        ...updateExpenseInput,
        ...(updateExpenseInput.date && {
          date: new Date(updateExpenseInput.date),
        }),
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string, _userId: string) {
    return this.prisma.expense.delete({
      where: {
        id,
      },
    });
  }
}
