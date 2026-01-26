import { ObjectType, Field } from "@nestjs/graphql";
import { Category } from "../../category/models/category.model";

@ObjectType()
export class Income {
  @Field()
  id: string;

  @Field()
  amount: number;

  @Field()
  date: Date;

  @Field({ nullable: true })
  note?: string;

  @Field()
  categoryId: string;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field(() => Category)
  category: Category;
}
