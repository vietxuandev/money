import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ExpenseService } from "./expense.service";
import { Expense } from "./models/expense.model";
import { CreateExpenseInput, UpdateExpenseInput } from "./dto/expense.input";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { User as PrismaUser } from "@prisma/client";

@Resolver(() => Expense)
@UseGuards(GqlAuthGuard)
export class ExpenseResolver {
  constructor(private expenseService: ExpenseService) {}

  @Query(() => [Expense])
  async expenses(
    @CurrentUser() user: PrismaUser,
    @Args("startDate", { type: () => Date, nullable: true }) startDate?: Date,
    @Args("endDate", { type: () => Date, nullable: true }) endDate?: Date,
  ) {
    return this.expenseService.findAll(user.id, startDate, endDate);
  }

  @Query(() => Expense, { nullable: true })
  async expense(@Args("id") id: string, @CurrentUser() user: PrismaUser) {
    return this.expenseService.findOne(id, user.id);
  }

  @Mutation(() => Expense)
  async createExpense(
    @Args("input") createExpenseInput: CreateExpenseInput,
    @CurrentUser() user: PrismaUser,
  ) {
    return this.expenseService.create(user.id, createExpenseInput);
  }

  @Mutation(() => Expense)
  async updateExpense(
    @Args("id") id: string,
    @Args("input") updateExpenseInput: UpdateExpenseInput,
    @CurrentUser() user: PrismaUser,
  ) {
    return this.expenseService.update(id, user.id, updateExpenseInput);
  }

  @Mutation(() => Expense)
  async deleteExpense(@Args("id") id: string, @CurrentUser() user: PrismaUser) {
    return this.expenseService.remove(id, user.id);
  }
}
