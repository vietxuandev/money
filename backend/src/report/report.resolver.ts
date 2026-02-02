import { Resolver, Query, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ReportService } from "./report.service";
import {
  ReportStatistics,
  TimeRange,
  OverallTotalValue,
} from "./models/report.model";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { User as PrismaUser } from "@prisma/client";

@Resolver()
@UseGuards(GqlAuthGuard)
export class ReportResolver {
  constructor(private reportService: ReportService) {}

  @Query(() => ReportStatistics)
  async reportStatistics(
    @CurrentUser() user: PrismaUser,
    @Args("range", { type: () => String }) range: TimeRange,
    @Args("referenceDate", { type: () => Date, nullable: true })
    referenceDate?: Date,
  ) {
    return this.reportService.getStatistics(user.id, range, referenceDate);
  }

  @Query(() => OverallTotalValue)
  async overallTotalValue(@CurrentUser() user: PrismaUser) {
    return this.reportService.getOverallTotalValue(user.id);
  }
}
