import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class AssetType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  unit: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;
}
