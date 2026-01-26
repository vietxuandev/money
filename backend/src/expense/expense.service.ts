import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExpenseInput, UpdateExpenseInput } from "./dto/expense.input";

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, startDate?: Date, endDate?: Date) {
    return this.prisma.expense.findMany({
      where: {
        userId,
        ...(startDate &&
          endDate && {
            date: {
              gte: startDate,
              lte: endDate,
            },
          }),
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });
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
    userId: string,
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

  async remove(id: string, userId: string) {
    return this.prisma.expense.delete({
      where: {
        id,
      },
    });
  }
}
