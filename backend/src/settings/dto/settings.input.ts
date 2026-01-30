import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Theme, Currency } from "../models/settings.model";

@InputType()
export class UpdateSettingInput {
  @Field(() => Theme, { nullable: true })
  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  language?: string;

  @Field(() => Currency, { nullable: true })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
