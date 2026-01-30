import { ObjectType, Field } from "@nestjs/graphql";
import { Income } from "./income.model";
import { PageInfo } from "../../common/models/pagination.model";

@ObjectType()
export class PaginatedIncomes {
  @Field(() => [Income])
  items: Income[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
