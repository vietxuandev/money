import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { IncomeService } from "./income.service";
import { Income } from "./models/income.model";
import { CreateIncomeInput, UpdateIncomeInput } from "./dto/income.input";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { User as PrismaUser } from "@prisma/client";

@Resolver(() => Income)
@UseGuards(GqlAuthGuard)
export class IncomeResolver {
  constructor(private incomeService: IncomeService) {}

  @Query(() => [Income])
  async incomes(
    @CurrentUser() user: PrismaUser,
    @Args("startDate", { type: () => Date, nullable: true }) startDate?: Date,
    @Args("endDate", { type: () => Date, nullable: true }) endDate?: Date,
  ) {
    return this.incomeService.findAll(user.id, startDate, endDate);
  }

  @Query(() => Income, { nullable: true })
  async income(@Args("id") id: string, @CurrentUser() user: PrismaUser) {
    return this.incomeService.findOne(id, user.id);
  }

  @Mutation(() => Income)
  async createIncome(
    @Args("input") createIncomeInput: CreateIncomeInput,
    @CurrentUser() user: PrismaUser,
  ) {
    return this.incomeService.create(user.id, createIncomeInput);
  }

  @Mutation(() => Income)
  async updateIncome(
    @Args("id") id: string,
    @Args("input") updateIncomeInput: UpdateIncomeInput,
    @CurrentUser() user: PrismaUser,
  ) {
    return this.incomeService.update(id, user.id, updateIncomeInput);
  }

  @Mutation(() => Income)
  async deleteIncome(@Args("id") id: string, @CurrentUser() user: PrismaUser) {
    return this.incomeService.remove(id, user.id);
  }
}
