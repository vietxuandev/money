import { Module } from "@nestjs/common";
import { IncomeService } from "./income.service";
import { IncomeResolver } from "./income.resolver";

@Module({
  providers: [IncomeService, IncomeResolver],
  exports: [IncomeService],
})
export class IncomeModule {}
