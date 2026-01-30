import { ObjectType, Field } from "@nestjs/graphql";
import { Category } from "./category.model";
import { PageInfo } from "../../common/models/pagination.model";

@ObjectType()
export class PaginatedCategories {
  @Field(() => [Category])
  items: Category[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
