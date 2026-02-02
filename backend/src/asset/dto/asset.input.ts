import { InputType, Field } from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from "class-validator";

@InputType()
export class CreateAssetInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  assetTypeId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  purchasePrice?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentSellPrice?: number;

  @Field()
  @IsNotEmpty()
  @IsDateString()
  purchaseDate: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  note?: string;
}

@InputType()
export class UpdateAssetInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assetTypeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  purchasePrice?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentSellPrice?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  note?: string;
}
