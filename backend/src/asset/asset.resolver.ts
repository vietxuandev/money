import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AssetService } from "./asset.service";
import { Asset } from "./models/asset.model";
import { CreateAssetInput, UpdateAssetInput } from "./dto/asset.input";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { User } from "@prisma/client";

@Resolver(() => Asset)
@UseGuards(GqlAuthGuard)
export class AssetResolver {
  constructor(private assetService: AssetService) {}

  @Query(() => [Asset])
  async assets(@CurrentUser() user: User) {
    return this.assetService.findAll(user.id);
  }

  @Query(() => Asset, { nullable: true })
  async asset(@Args("id") id: string, @CurrentUser() user: User) {
    return this.assetService.findOne(id, user.id);
  }

  @Mutation(() => Asset)
  async createAsset(
    @Args("input") input: CreateAssetInput,
    @CurrentUser() user: User,
  ) {
    return this.assetService.create(user.id, input);
  }

  @Mutation(() => Asset)
  async updateAsset(
    @Args("id") id: string,
    @Args("input") input: UpdateAssetInput,
    @CurrentUser() user: User,
  ) {
    return this.assetService.update(id, user.id, input);
  }

  @Mutation(() => Asset)
  async deleteAsset(@Args("id") id: string, @CurrentUser() user: User) {
    return this.assetService.remove(id, user.id);
  }
}
