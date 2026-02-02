import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";

export enum TimeRange {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  QUARTER = "QUARTER",
  YEAR = "YEAR",
}

registerEnumType(TimeRange, {
  name: "TimeRange",
});

@ObjectType()
export class CategorySummary {
  @Field()
  categoryId: string;

  @Field()
  categoryName: string;

  @Field()
  total: number;

  @Field()
  count: number;
}

@ObjectType()
export class OverallTotalValue {
  @Field()
  totalValue: number;

  @Field()
  totalIncome: number;

  @Field()
  totalExpense: number;

  @Field()
  totalAssets: number;
}

@ObjectType()
export class ReportStatistics {
  @Field()
  totalIncome: number;

  @Field()
  totalExpense: number;

  @Field()
  balance: number;

  @Field()
  totalAssets: number;

  @Field()
  totalValue: number;

  @Field(() => [CategorySummary])
  incomeByCategory: CategorySummary[];

  @Field(() => [CategorySummary])
  expenseByCategory: CategorySummary[];

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}
