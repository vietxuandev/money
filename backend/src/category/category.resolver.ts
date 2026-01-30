import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./models/category.model";
import { PaginatedCategories } from "./models/paginated-category.model";
import { CreateCategoryInput, UpdateCategoryInput } from "./dto/category.input";
import { PaginationInput } from "../common/dto/pagination.input";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { User, CategoryType } from "@prisma/client";

@Resolver(() => Category)
@UseGuards(GqlAuthGuard)
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => [Category])
  async categories(
    @CurrentUser() user: User,
    @Args("type", { type: () => String, nullable: true }) type?: CategoryType,
  ) {
    return this.categoryService.findAll(user.id, type);
  }

  @Query(() => PaginatedCategories)
  async paginatedCategories(
    @CurrentUser() user: User,
    @Args("pagination", { type: () => PaginationInput })
    pagination: PaginationInput,
    @Args("type", { type: () => String, nullable: true }) type?: CategoryType,
  ) {
    return this.categoryService.findAll(user.id, type, pagination);
  }

  @Query(() => Category, { nullable: true })
  async category(@Args("id") id: string, @CurrentUser() user: User) {
    return this.categoryService.findOne(id, user.id);
  }

  @Mutation(() => Category)
  async createCategory(
    @Args("input") createCategoryInput: CreateCategoryInput,
    @CurrentUser() user: User,
  ) {
    return this.categoryService.create(user.id, createCategoryInput);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args("id") id: string,
    @Args("input") updateCategoryInput: UpdateCategoryInput,
    @CurrentUser() user: User,
  ) {
    return this.categoryService.update(id, user.id, updateCategoryInput);
  }

  @Mutation(() => Category)
  async deleteCategory(@Args("id") id: string, @CurrentUser() user: User) {
    return this.categoryService.remove(id, user.id);
  }
}
