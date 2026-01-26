import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TimeRange, CategorySummary } from "./models/report.model";

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  private getDateRange(
    range: TimeRange,
    referenceDate?: Date,
  ): { startDate: Date; endDate: Date } {
    const now = referenceDate || new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    switch (range) {
      case TimeRange.DAY:
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case TimeRange.WEEK:
        startDate = new Date(now);
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
        startDate.setDate(diff);
        startDate.setHours(0, 0, 0, 0);
        break;
      case TimeRange.MONTH:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case TimeRange.QUARTER:
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case TimeRange.YEAR:
        startDate = new Date(now.getFullYear(), 0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    return { startDate, endDate };
  }

  async getStatistics(userId: string, range: TimeRange, referenceDate?: Date) {
    const { startDate, endDate } = this.getDateRange(range, referenceDate);

    // Get all categories for this user to lookup parent names
    const allCategories = await this.prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    });

    const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));

    // Get expenses
    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    // Get incomes
    const incomes = await this.prisma.income.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    // Calculate totals
    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const balance = totalIncome - totalExpense;

    // Group expenses by category
    const expenseByCategory: CategorySummary[] = [];
    const expenseMap = new Map<
      string,
      { total: number; count: number; name: string }
    >();

    expenses.forEach((expense) => {
      // Use parent category if it exists, otherwise use the category itself
      const categoryId = expense.category.parentId || expense.categoryId;
      const parentCategory = expense.category.parentId
        ? categoryMap.get(expense.category.parentId)
        : null;
      const categoryName = parentCategory
        ? parentCategory.name
        : expense.category.name;

      const existing = expenseMap.get(categoryId);
      if (existing) {
        existing.total += expense.amount;
        existing.count += 1;
      } else {
        expenseMap.set(categoryId, {
          total: expense.amount,
          count: 1,
          name: categoryName,
        });
      }
    });

    expenseMap.forEach((value, key) => {
      expenseByCategory.push({
        categoryId: key,
        categoryName: value.name,
        total: value.total,
        count: value.count,
      });
    });

    // Group incomes by category
    const incomeByCategory: CategorySummary[] = [];
    const incomeMap = new Map<
      string,
      { total: number; count: number; name: string }
    >();

    incomes.forEach((income) => {
      // Use parent category if it exists, otherwise use the category itself
      const categoryId = income.category.parentId || income.categoryId;
      const parentCategory = income.category.parentId
        ? categoryMap.get(income.category.parentId)
        : null;
      const categoryName = parentCategory
        ? parentCategory.name
        : income.category.name;

      const existing = incomeMap.get(categoryId);
      if (existing) {
        existing.total += income.amount;
        existing.count += 1;
      } else {
        incomeMap.set(categoryId, {
          total: income.amount,
          count: 1,
          name: categoryName,
        });
      }
    });

    incomeMap.forEach((value, key) => {
      incomeByCategory.push({
        categoryId: key,
        categoryName: value.name,
        total: value.total,
        count: value.count,
      });
    });

    return {
      totalIncome,
      totalExpense,
      balance,
      incomeByCategory,
      expenseByCategory,
      startDate,
      endDate,
    };
  }
}
