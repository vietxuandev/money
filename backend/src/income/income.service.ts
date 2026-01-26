import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateIncomeInput, UpdateIncomeInput } from "./dto/income.input";

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, startDate?: Date, endDate?: Date) {
    return this.prisma.income.findMany({
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
    userId: string,
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

  async remove(id: string, userId: string) {
    return this.prisma.income.delete({
      where: {
        id,
      },
    });
  }
}
