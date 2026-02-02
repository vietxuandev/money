import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AssetTypeService } from "./asset-type.service";
import { AssetType } from "./models/asset-type.model";
import {
  CreateAssetTypeInput,
  UpdateAssetTypeInput,
} from "./dto/asset-type.input";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { User } from "@prisma/client";

@Resolver(() => AssetType)
@UseGuards(GqlAuthGuard)
export class AssetTypeResolver {
  constructor(private assetTypeService: AssetTypeService) {}

  @Query(() => [AssetType])
  async assetTypes(@CurrentUser() user: User) {
    return this.assetTypeService.findAll(user.id);
  }

  @Query(() => AssetType, { nullable: true })
  async assetType(@Args("id") id: string, @CurrentUser() user: User) {
    return this.assetTypeService.findOne(id, user.id);
  }

  @Mutation(() => AssetType)
  async createAssetType(
    @Args("input") input: CreateAssetTypeInput,
    @CurrentUser() user: User,
  ) {
    return this.assetTypeService.create(user.id, input);
  }

  @Mutation(() => AssetType)
  async updateAssetType(
    @Args("id") id: string,
    @Args("input") input: UpdateAssetTypeInput,
    @CurrentUser() user: User,
  ) {
    return this.assetTypeService.update(id, user.id, input);
  }

  @Mutation(() => AssetType)
  async deleteAssetType(@Args("id") id: string, @CurrentUser() user: User) {
    return this.assetTypeService.remove(id, user.id);
  }
}
