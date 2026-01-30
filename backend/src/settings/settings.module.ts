import { Module } from "@nestjs/common";
import { SettingsResolver } from "./settings.resolver";
import { SettingsService } from "./settings.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [SettingsResolver, SettingsService],
})
export class SettingsModule {}
