import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

@InputType()
export class CreateExpenseInput {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  date: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  note?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}

@InputType()
export class UpdateExpenseInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  date?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  note?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
