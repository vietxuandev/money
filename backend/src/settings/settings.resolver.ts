import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { UserSetting } from "./models/settings.model";
import { UpdateSettingInput } from "./dto/settings.input";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { User as PrismaUser } from "@prisma/client";

@Resolver(() => UserSetting)
@UseGuards(GqlAuthGuard)
export class SettingsResolver {
  constructor(private settingsService: SettingsService) {}

  @Query(() => UserSetting)
  async userSettings(@CurrentUser() user: PrismaUser) {
    return this.settingsService.getUserSettings(user.id);
  }

  @Mutation(() => UserSetting)
  async updateUserSettings(
    @CurrentUser() user: PrismaUser,
    @Args("input") input: UpdateSettingInput,
  ) {
    return this.settingsService.updateUserSettings(user.id, input);
  }
}
