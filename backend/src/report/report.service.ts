import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AssetService } from "../asset/asset.service";
import { TimeRange, CategorySummary } from "./models/report.model";

@Injectable()
export class ReportService {
  constructor(
    private prisma: PrismaService,
    private assetService: AssetService,
  ) {}

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

    const where = {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

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

    // Calculate expense total using database aggregation
    const expenseAggregate = await this.prisma.expense.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });

    // Calculate income total using database aggregation
    const incomeAggregate = await this.prisma.income.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });

    const totalExpense = expenseAggregate._sum.amount || 0;
    const totalIncome = incomeAggregate._sum.amount || 0;
    const balance = totalIncome - totalExpense;

    // Get total asset value using database query
    const totalAssets = await this.assetService.getTotalAssetValue(userId);

    // Calculate total value = income + assets - expenses
    const totalValue = totalIncome + totalAssets - totalExpense;

    // Get expenses grouped by category with aggregation
    const expenseGroups = await this.prisma.expense.groupBy({
      where,
      by: ["categoryId"],
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // Build expense by category summary
    const expenseByCategory: CategorySummary[] = [];
    const expenseCategoryMap = new Map<
      string,
      { total: number; count: number; name: string }
    >();

    expenseGroups.forEach((group) => {
      const category = categoryMap.get(group.categoryId);
      if (!category) return;

      // Use parent category if it exists
      const categoryId = category.parentId || group.categoryId;
      const parentCategory = category.parentId
        ? categoryMap.get(category.parentId)
        : null;
      const categoryName = parentCategory ? parentCategory.name : category.name;

      const existing = expenseCategoryMap.get(categoryId);
      const total = group._sum.amount || 0;
      const count = group._count.id;

      if (existing) {
        existing.total += total;
        existing.count += count;
      } else {
        expenseCategoryMap.set(categoryId, {
          total,
          count,
          name: categoryName,
        });
      }
    });

    expenseCategoryMap.forEach((value, key) => {
      expenseByCategory.push({
        categoryId: key,
        categoryName: value.name,
        total: value.total,
        count: value.count,
      });
    });

    // Get incomes grouped by category with aggregation
    const incomeGroups = await this.prisma.income.groupBy({
      where,
      by: ["categoryId"],
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // Build income by category summary
    const incomeByCategory: CategorySummary[] = [];
    const incomeCategoryMap = new Map<
      string,
      { total: number; count: number; name: string }
    >();

    incomeGroups.forEach((group) => {
      const category = categoryMap.get(group.categoryId);
      if (!category) return;

      // Use parent category if it exists
      const categoryId = category.parentId || group.categoryId;
      const parentCategory = category.parentId
        ? categoryMap.get(category.parentId)
        : null;
      const categoryName = parentCategory ? parentCategory.name : category.name;

      const existing = incomeCategoryMap.get(categoryId);
      const total = group._sum.amount || 0;
      const count = group._count.id;

      if (existing) {
        existing.total += total;
        existing.count += count;
      } else {
        incomeCategoryMap.set(categoryId, {
          total,
          count,
          name: categoryName,
        });
      }
    });

    incomeCategoryMap.forEach((value, key) => {
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
      totalAssets,
      totalValue,
      incomeByCategory,
      expenseByCategory,
      startDate,
      endDate,
    };
  }
}
