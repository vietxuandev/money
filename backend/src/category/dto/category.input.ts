import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsEnum, IsOptional } from "class-validator";
import { CategoryType } from "@prisma/client";

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String)
  @IsEnum(CategoryType)
  type: CategoryType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string;
}

@InputType()
export class UpdateCategoryInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string;
}
