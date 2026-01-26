import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";
import { CategoryType } from "@prisma/client";

registerEnumType(CategoryType, {
  name: "CategoryType",
});

@ObjectType()
export class Category {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => CategoryType)
  type: CategoryType;

  @Field({ nullable: true })
  parentId?: string;

  @Field()
  userId: string;

  @Field(() => [Category], { nullable: true })
  children?: Category[];

  @Field(() => Category, { nullable: true })
  parent?: Category;
}
