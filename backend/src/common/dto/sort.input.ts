import { InputType, Field, registerEnumType } from "@nestjs/graphql";

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export enum ExpenseSortField {
  DATE = "date",
  AMOUNT = "amount",
}

export enum IncomeSortField {
  DATE = "date",
  AMOUNT = "amount",
}

registerEnumType(SortDirection, {
  name: "SortDirection",
});

registerEnumType(ExpenseSortField, {
  name: "ExpenseSortField",
});

registerEnumType(IncomeSortField, {
  name: "IncomeSortField",
});

@InputType()
export class ExpenseSortInput {
  @Field(() => ExpenseSortField, { defaultValue: ExpenseSortField.DATE })
  sortBy: ExpenseSortField;

  @Field(() => SortDirection, { defaultValue: SortDirection.DESC })
  sortDirection: SortDirection;
}

@InputType()
export class IncomeSortInput {
  @Field(() => IncomeSortField, { defaultValue: IncomeSortField.DATE })
  sortBy: IncomeSortField;

  @Field(() => SortDirection, { defaultValue: SortDirection.DESC })
  sortDirection: SortDirection;
}
