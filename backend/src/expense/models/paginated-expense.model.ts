import { ObjectType, Field } from "@nestjs/graphql";
import { Expense } from "./expense.model";
import { PageInfo } from "../../common/models/pagination.model";

@ObjectType()
export class PaginatedExpenses {
  @Field(() => [Expense])
  items: Expense[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
