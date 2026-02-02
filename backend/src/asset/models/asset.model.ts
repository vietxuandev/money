import { ObjectType, Field } from "@nestjs/graphql";
import { AssetType } from "../../asset-type/models/asset-type.model";

@ObjectType()
export class Asset {
  @Field()
  id: string;

  @Field()
  assetTypeId: string;

  @Field()
  name: string;

  @Field()
  quantity: number;

  @Field()
  purchasePrice: number;

  @Field()
  currentSellPrice: number;

  @Field()
  purchaseDate: Date;

  @Field({ nullable: true })
  note?: string;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field(() => AssetType, { nullable: true })
  assetType?: AssetType;

  @Field()
  totalValue: number;
}
