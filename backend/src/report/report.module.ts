import { Module } from "@nestjs/common";
import { ReportService } from "./report.service";
import { ReportResolver } from "./report.resolver";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [AssetModule],
  providers: [ReportService, ReportResolver],
})
export class ReportModule {}
