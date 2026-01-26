import { Resolver, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { User } from "../auth/models/auth.model";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

type PrismaUser = {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
};

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: PrismaUser): Promise<User> {
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}
