import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateSettingInput } from "./dto/settings.input";
import { Theme, Currency } from "./models/settings.model";

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getUserSettings(userId: string) {
    let settings = await this.prisma.userSetting.findUnique({
      where: { userId },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await this.prisma.userSetting.create({
        data: {
          userId,
          theme: Theme.LIGHT,
          language: "en",
          currency: Currency.USD,
        },
      });
    }

    return settings;
  }

  async updateUserSettings(userId: string, input: UpdateSettingInput) {
    // First, ensure settings exist
    await this.getUserSettings(userId);

    // Then update
    return this.prisma.userSetting.update({
      where: { userId },
      data: input,
    });
  }
}
