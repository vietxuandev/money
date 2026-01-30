import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum Theme {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

export enum Currency {
  USD = "USD",
  VND = "VND",
}

registerEnumType(Theme, {
  name: "Theme",
  description: "User interface theme",
});

registerEnumType(Currency, {
  name: "Currency",
  description: "User preferred currency",
});

@ObjectType()
export class UserSetting {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => Theme)
  theme: Theme;

  @Field()
  language: string;

  @Field(() => Currency)
  currency: Currency;

  @Field()
  updatedAt: Date;
}
