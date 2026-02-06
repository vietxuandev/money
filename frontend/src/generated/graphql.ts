import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client/react';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type Asset = {
  __typename: 'Asset';
  assetType: Maybe<AssetType>;
  assetTypeId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currentSellPrice: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  note: Maybe<Scalars['String']['output']>;
  purchaseDate: Scalars['DateTime']['output'];
  purchasePrice: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
  totalValue: Scalars['Float']['output'];
  userId: Scalars['String']['output'];
};

export type AssetType = {
  __typename: 'AssetType';
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  unit: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type AuthPayload = {
  __typename: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  user: User;
};

export type Category = {
  __typename: 'Category';
  children: Maybe<Array<Category>>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  parent: Maybe<Category>;
  parentId: Maybe<Scalars['String']['output']>;
  type: CategoryType;
  userId: Scalars['String']['output'];
};

export type CategorySummary = {
  __typename: 'CategorySummary';
  categoryId: Scalars['String']['output'];
  categoryName: Scalars['String']['output'];
  count: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
};

export type CategoryType =
  | 'EXPENSE'
  | 'INCOME';

export type CreateAssetInput = {
  assetTypeId: Scalars['String']['input'];
  currentSellPrice?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  purchaseDate: Scalars['String']['input'];
  purchasePrice?: InputMaybe<Scalars['Float']['input']>;
  quantity: Scalars['Float']['input'];
};

export type CreateAssetTypeInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  unit: Scalars['String']['input'];
};

export type CreateCategoryInput = {
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};

export type CreateExpenseInput = {
  amount: Scalars['Float']['input'];
  categoryId: Scalars['String']['input'];
  date: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type CreateIncomeInput = {
  amount: Scalars['Float']['input'];
  categoryId: Scalars['String']['input'];
  date: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

/** User preferred currency */
export type Currency =
  | 'USD'
  | 'VND';

export type Expense = {
  __typename: 'Expense';
  amount: Scalars['Float']['output'];
  category: Category;
  categoryId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  note: Maybe<Scalars['String']['output']>;
  userId: Scalars['String']['output'];
};

export type ExpenseSortField =
  | 'AMOUNT'
  | 'CREATED_AT'
  | 'DATE';

export type ExpenseSortInput = {
  sortBy?: ExpenseSortField;
  sortDirection?: SortDirection;
};

export type Income = {
  __typename: 'Income';
  amount: Scalars['Float']['output'];
  category: Category;
  categoryId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  note: Maybe<Scalars['String']['output']>;
  userId: Scalars['String']['output'];
};

export type IncomeSortField =
  | 'AMOUNT'
  | 'CREATED_AT'
  | 'DATE';

export type IncomeSortInput = {
  sortBy?: IncomeSortField;
  sortDirection?: SortDirection;
};

export type LoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
  createAsset: Asset;
  createAssetType: AssetType;
  createCategory: Category;
  createExpense: Expense;
  createIncome: Income;
  deleteAsset: Asset;
  deleteAssetType: AssetType;
  deleteCategory: Category;
  deleteExpense: Expense;
  deleteIncome: Income;
  login: AuthPayload;
  register: AuthPayload;
  updateAsset: Asset;
  updateAssetType: AssetType;
  updateCategory: Category;
  updateExpense: Expense;
  updateIncome: Income;
  updateUserSettings: UserSetting;
};


export type MutationCreateAssetArgs = {
  input: CreateAssetInput;
};


export type MutationCreateAssetTypeArgs = {
  input: CreateAssetTypeInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateExpenseArgs = {
  input: CreateExpenseInput;
};


export type MutationCreateIncomeArgs = {
  input: CreateIncomeInput;
};


export type MutationDeleteAssetArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteAssetTypeArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteExpenseArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteIncomeArgs = {
  id: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationUpdateAssetArgs = {
  id: Scalars['String']['input'];
  input: UpdateAssetInput;
};


export type MutationUpdateAssetTypeArgs = {
  id: Scalars['String']['input'];
  input: UpdateAssetTypeInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['String']['input'];
  input: UpdateCategoryInput;
};


export type MutationUpdateExpenseArgs = {
  id: Scalars['String']['input'];
  input: UpdateExpenseInput;
};


export type MutationUpdateIncomeArgs = {
  id: Scalars['String']['input'];
  input: UpdateIncomeInput;
};


export type MutationUpdateUserSettingsArgs = {
  input: UpdateSettingInput;
};

export type OverallTotalValue = {
  __typename: 'OverallTotalValue';
  totalAssets: Scalars['Float']['output'];
  totalExpense: Scalars['Float']['output'];
  totalIncome: Scalars['Float']['output'];
  totalValue: Scalars['Float']['output'];
};

export type PageInfo = {
  __typename: 'PageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedCategories = {
  __typename: 'PaginatedCategories';
  items: Array<Category>;
  pageInfo: PageInfo;
};

export type PaginatedExpenses = {
  __typename: 'PaginatedExpenses';
  items: Array<Expense>;
  pageInfo: PageInfo;
};

export type PaginatedIncomes = {
  __typename: 'PaginatedIncomes';
  items: Array<Income>;
  pageInfo: PageInfo;
};

export type PaginationInput = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
};

export type Query = {
  __typename: 'Query';
  asset: Maybe<Asset>;
  assetType: Maybe<AssetType>;
  assetTypes: Array<AssetType>;
  assets: Array<Asset>;
  categories: Array<Category>;
  category: Maybe<Category>;
  expense: Maybe<Expense>;
  expenses: Array<Expense>;
  income: Maybe<Income>;
  incomes: Array<Income>;
  me: User;
  overallTotalValue: OverallTotalValue;
  paginatedCategories: PaginatedCategories;
  paginatedExpenses: PaginatedExpenses;
  paginatedIncomes: PaginatedIncomes;
  reportStatistics: ReportStatistics;
  userSettings: UserSetting;
};


export type QueryAssetArgs = {
  id: Scalars['String']['input'];
};


export type QueryAssetTypeArgs = {
  id: Scalars['String']['input'];
};


export type QueryCategoriesArgs = {
  isParent?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryExpenseArgs = {
  id: Scalars['String']['input'];
};


export type QueryExpensesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  sort?: InputMaybe<ExpenseSortInput>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryIncomeArgs = {
  id: Scalars['String']['input'];
};


export type QueryIncomesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  sort?: InputMaybe<IncomeSortInput>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryPaginatedCategoriesArgs = {
  isParent?: InputMaybe<Scalars['Boolean']['input']>;
  pagination: PaginationInput;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPaginatedExpensesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  pagination: PaginationInput;
  sort?: InputMaybe<ExpenseSortInput>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryPaginatedIncomesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  pagination: PaginationInput;
  sort?: InputMaybe<IncomeSortInput>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryReportStatisticsArgs = {
  range: Scalars['String']['input'];
  referenceDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type RegisterInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type ReportStatistics = {
  __typename: 'ReportStatistics';
  balance: Scalars['Float']['output'];
  endDate: Scalars['DateTime']['output'];
  expenseByCategory: Array<CategorySummary>;
  incomeByCategory: Array<CategorySummary>;
  startDate: Scalars['DateTime']['output'];
  totalAssets: Scalars['Float']['output'];
  totalExpense: Scalars['Float']['output'];
  totalIncome: Scalars['Float']['output'];
  totalValue: Scalars['Float']['output'];
};

export type SortDirection =
  | 'ASC'
  | 'DESC';

/** User interface theme */
export type Theme =
  | 'DARK'
  | 'LIGHT';

export type UpdateAssetInput = {
  assetTypeId?: InputMaybe<Scalars['String']['input']>;
  currentSellPrice?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  purchaseDate?: InputMaybe<Scalars['String']['input']>;
  purchasePrice?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateAssetTypeInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateExpenseInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateIncomeInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSettingInput = {
  currency?: InputMaybe<Currency>;
  language?: InputMaybe<Scalars['String']['input']>;
  theme?: InputMaybe<Theme>;
};

export type User = {
  __typename: 'User';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserSetting = {
  __typename: 'UserSetting';
  currency: Currency;
  id: Scalars['String']['output'];
  language: Scalars['String']['output'];
  theme: Theme;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type AssetTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type AssetTypesQuery = { assetTypes: Array<{ __typename: 'AssetType', id: string, name: string, unit: string, description: string | null, createdAt: string }> };

export type AssetTypeQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type AssetTypeQuery = { assetType: { __typename: 'AssetType', id: string, name: string, unit: string, description: string | null, createdAt: string } | null };

export type CreateAssetTypeMutationVariables = Exact<{
  input: CreateAssetTypeInput;
}>;


export type CreateAssetTypeMutation = { createAssetType: { __typename: 'AssetType', id: string, name: string, unit: string, description: string | null, createdAt: string } };

export type UpdateAssetTypeMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateAssetTypeInput;
}>;


export type UpdateAssetTypeMutation = { updateAssetType: { __typename: 'AssetType', id: string, name: string, unit: string, description: string | null, createdAt: string } };

export type DeleteAssetTypeMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteAssetTypeMutation = { deleteAssetType: { __typename: 'AssetType', id: string } };

export type AssetsQueryVariables = Exact<{ [key: string]: never; }>;


export type AssetsQuery = { assets: Array<{ __typename: 'Asset', id: string, assetTypeId: string, name: string, quantity: number, purchasePrice: number, currentSellPrice: number, purchaseDate: string, note: string | null, createdAt: string, totalValue: number, assetType: { __typename: 'AssetType', id: string, name: string, unit: string } | null }> };

export type AssetQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type AssetQuery = { asset: { __typename: 'Asset', id: string, assetTypeId: string, name: string, quantity: number, purchasePrice: number, currentSellPrice: number, purchaseDate: string, note: string | null, createdAt: string, totalValue: number, assetType: { __typename: 'AssetType', id: string, name: string, unit: string } | null } | null };

export type CreateAssetMutationVariables = Exact<{
  input: CreateAssetInput;
}>;


export type CreateAssetMutation = { createAsset: { __typename: 'Asset', id: string, assetTypeId: string, name: string, quantity: number, purchasePrice: number, currentSellPrice: number, purchaseDate: string, note: string | null, createdAt: string, totalValue: number, assetType: { __typename: 'AssetType', id: string, name: string, unit: string } | null } };

export type UpdateAssetMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateAssetInput;
}>;


export type UpdateAssetMutation = { updateAsset: { __typename: 'Asset', id: string, assetTypeId: string, name: string, quantity: number, purchasePrice: number, currentSellPrice: number, purchaseDate: string, note: string | null, createdAt: string, totalValue: number, assetType: { __typename: 'AssetType', id: string, name: string, unit: string } | null } };

export type DeleteAssetMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteAssetMutation = { deleteAsset: { __typename: 'Asset', id: string } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { register: { __typename: 'AuthPayload', accessToken: string, user: { __typename: 'User', id: string, username: string, createdAt: string } } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { login: { __typename: 'AuthPayload', accessToken: string, user: { __typename: 'User', id: string, username: string, createdAt: string } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { __typename: 'User', id: string, username: string, createdAt: string } };

export type CategoriesQueryVariables = Exact<{
  type?: InputMaybe<Scalars['String']['input']>;
  isParent?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CategoriesQuery = { categories: Array<{ __typename: 'Category', id: string, name: string, type: CategoryType, parentId: string | null, userId: string, children: Array<{ __typename: 'Category', id: string, name: string, type: CategoryType, parentId: string | null }> | null }> };

export type PaginatedCategoriesQueryVariables = Exact<{
  pagination: PaginationInput;
  type?: InputMaybe<Scalars['String']['input']>;
  isParent?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type PaginatedCategoriesQuery = { paginatedCategories: { __typename: 'PaginatedCategories', items: Array<{ __typename: 'Category', id: string, name: string, type: CategoryType, parentId: string | null, userId: string, children: Array<{ __typename: 'Category', id: string, name: string, type: CategoryType, parentId: string | null }> | null }>, pageInfo: { __typename: 'PageInfo', total: number, page: number, limit: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type CategoryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type CategoryQuery = { category: { __typename: 'Category', id: string, name: string, type: CategoryType, parentId: string | null, userId: string, children: Array<{ __typename: 'Category', id: string, name: string }> | null, parent: { __typename: 'Category', id: string, name: string } | null } | null };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { createCategory: { __typename: 'Category', id: string, name: string, type: CategoryType, parentId: string | null, userId: string } };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { updateCategory: { __typename: 'Category', id: string, name: string, type: CategoryType, parentId: string | null, userId: string } };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteCategoryMutation = { deleteCategory: { __typename: 'Category', id: string } };

export type ExpensesQueryVariables = Exact<{
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  sort?: InputMaybe<ExpenseSortInput>;
}>;


export type ExpensesQuery = { expenses: Array<{ __typename: 'Expense', id: string, amount: number, date: string, note: string | null, categoryId: string, userId: string, createdAt: string, category: { __typename: 'Category', id: string, name: string, type: CategoryType } }> };

export type PaginatedExpensesQueryVariables = Exact<{
  pagination: PaginationInput;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  sort?: InputMaybe<ExpenseSortInput>;
}>;


export type PaginatedExpensesQuery = { paginatedExpenses: { __typename: 'PaginatedExpenses', items: Array<{ __typename: 'Expense', id: string, amount: number, date: string, note: string | null, categoryId: string, userId: string, createdAt: string, category: { __typename: 'Category', id: string, name: string, type: CategoryType } }>, pageInfo: { __typename: 'PageInfo', total: number, page: number, limit: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type ExpenseQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ExpenseQuery = { expense: { __typename: 'Expense', id: string, amount: number, date: string, note: string | null, categoryId: string, userId: string, createdAt: string, category: { __typename: 'Category', id: string, name: string } } | null };

export type CreateExpenseMutationVariables = Exact<{
  input: CreateExpenseInput;
}>;


export type CreateExpenseMutation = { createExpense: { __typename: 'Expense', id: string, amount: number, date: string, note: string | null, categoryId: string, userId: string, createdAt: string } };

export type UpdateExpenseMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateExpenseInput;
}>;


export type UpdateExpenseMutation = { updateExpense: { __typename: 'Expense', id: string, amount: number, date: string, note: string | null, categoryId: string, userId: string } };

export type DeleteExpenseMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteExpenseMutation = { deleteExpense: { __typename: 'Expense', id: string } };

export type IncomesQueryVariables = Exact<{
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  sort?: InputMaybe<IncomeSortInput>;
}>;


export type IncomesQuery = { incomes: Array<{ __typename: 'Income', id: string, amount: number, date: string, note: string | null, categoryId: string, userId: string, createdAt: string, category: { __typename: 'Category', id: string, name: string, type: CategoryType } }> };

export type PaginatedIncomesQueryVariables = Exact<{
  pagination: PaginationInput;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  sort?: InputMaybe<IncomeSortInput>;
}>;


export type PaginatedIncomesQuery = { paginatedIncomes: { __typename: 'PaginatedIncomes', items: Array<{ __typename: 'Income', id: string, amount: number, date: string, note: string | null, categoryId: string, userId: string, createdAt: string, category: { __typename: 'Category', id: string, name: string, type: CategoryType } }>, pageInfo: { __typename: 'PageInfo', total: number, page: number, limit: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type IncomeQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type IncomeQuery = { income: { __typename: 'Income', id: string, amount: number, date: string, note: string | null, categoryId: string, userId: string, createdAt: string, category: { __typename: 'Category', id: string, name: string } } | null };

export type CreateIncomeMutationVariables = Exact<{
  input: CreateIncomeInput;
}>;


export type CreateIncomeMutation = { createIncome: { __typename: 'Income', id: string, amount: number, date: string, note: string | null, categoryId: string, userId: string, createdAt: string } };

export type UpdateIncomeMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateIncomeInput;
}>;


export type UpdateIncomeMutation = { updateIncome: { __typename: 'Income', id: string, amount: number, date: string, note: string | null, categoryId: string, userId: string } };

export type DeleteIncomeMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteIncomeMutation = { deleteIncome: { __typename: 'Income', id: string } };

export type ReportStatisticsQueryVariables = Exact<{
  range: Scalars['String']['input'];
  referenceDate?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type ReportStatisticsQuery = { reportStatistics: { __typename: 'ReportStatistics', totalIncome: number, totalExpense: number, balance: number, totalAssets: number, totalValue: number, startDate: string, endDate: string, expenseByCategory: Array<{ __typename: 'CategorySummary', categoryId: string, categoryName: string, count: number, total: number }>, incomeByCategory: Array<{ __typename: 'CategorySummary', categoryId: string, categoryName: string, count: number, total: number }> } };

export type OverallTotalValueQueryVariables = Exact<{ [key: string]: never; }>;


export type OverallTotalValueQuery = { overallTotalValue: { __typename: 'OverallTotalValue', totalValue: number, totalIncome: number, totalExpense: number, totalAssets: number } };

export type UserSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserSettingsQuery = { userSettings: { __typename: 'UserSetting', id: string, userId: string, theme: Theme, language: string, currency: Currency, updatedAt: string } };

export type UpdateUserSettingsMutationVariables = Exact<{
  input: UpdateSettingInput;
}>;


export type UpdateUserSettingsMutation = { updateUserSettings: { __typename: 'UserSetting', id: string, userId: string, theme: Theme, language: string, currency: Currency, updatedAt: string } };


export const AssetTypesDocument = gql`
    query AssetTypes {
  assetTypes {
    id
    name
    unit
    description
    createdAt
  }
}
    `;

/**
 * __useAssetTypesQuery__
 *
 * To run a query within a React component, call `useAssetTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAssetTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAssetTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAssetTypesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AssetTypesQuery, AssetTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AssetTypesQuery, AssetTypesQueryVariables>(AssetTypesDocument, options);
      }
export function useAssetTypesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AssetTypesQuery, AssetTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AssetTypesQuery, AssetTypesQueryVariables>(AssetTypesDocument, options);
        }
// @ts-ignore
export function useAssetTypesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<AssetTypesQuery, AssetTypesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AssetTypesQuery, AssetTypesQueryVariables>;
export function useAssetTypesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AssetTypesQuery, AssetTypesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AssetTypesQuery | undefined, AssetTypesQueryVariables>;
export function useAssetTypesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AssetTypesQuery, AssetTypesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AssetTypesQuery, AssetTypesQueryVariables>(AssetTypesDocument, options);
        }
export type AssetTypesQueryHookResult = ReturnType<typeof useAssetTypesQuery>;
export type AssetTypesLazyQueryHookResult = ReturnType<typeof useAssetTypesLazyQuery>;
export type AssetTypesSuspenseQueryHookResult = ReturnType<typeof useAssetTypesSuspenseQuery>;
export type AssetTypesQueryResult = Apollo.QueryResult<AssetTypesQuery, AssetTypesQueryVariables>;
export const AssetTypeDocument = gql`
    query AssetType($id: String!) {
  assetType(id: $id) {
    id
    name
    unit
    description
    createdAt
  }
}
    `;

/**
 * __useAssetTypeQuery__
 *
 * To run a query within a React component, call `useAssetTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useAssetTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAssetTypeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAssetTypeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<AssetTypeQuery, AssetTypeQueryVariables> & ({ variables: AssetTypeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AssetTypeQuery, AssetTypeQueryVariables>(AssetTypeDocument, options);
      }
export function useAssetTypeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AssetTypeQuery, AssetTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AssetTypeQuery, AssetTypeQueryVariables>(AssetTypeDocument, options);
        }
// @ts-ignore
export function useAssetTypeSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<AssetTypeQuery, AssetTypeQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AssetTypeQuery, AssetTypeQueryVariables>;
export function useAssetTypeSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AssetTypeQuery, AssetTypeQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AssetTypeQuery | undefined, AssetTypeQueryVariables>;
export function useAssetTypeSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AssetTypeQuery, AssetTypeQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AssetTypeQuery, AssetTypeQueryVariables>(AssetTypeDocument, options);
        }
export type AssetTypeQueryHookResult = ReturnType<typeof useAssetTypeQuery>;
export type AssetTypeLazyQueryHookResult = ReturnType<typeof useAssetTypeLazyQuery>;
export type AssetTypeSuspenseQueryHookResult = ReturnType<typeof useAssetTypeSuspenseQuery>;
export type AssetTypeQueryResult = Apollo.QueryResult<AssetTypeQuery, AssetTypeQueryVariables>;
export const CreateAssetTypeDocument = gql`
    mutation CreateAssetType($input: CreateAssetTypeInput!) {
  createAssetType(input: $input) {
    id
    name
    unit
    description
    createdAt
  }
}
    `;
export type CreateAssetTypeMutationFn = Apollo.MutationFunction<CreateAssetTypeMutation, CreateAssetTypeMutationVariables>;

/**
 * __useCreateAssetTypeMutation__
 *
 * To run a mutation, you first call `useCreateAssetTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAssetTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAssetTypeMutation, { data, loading, error }] = useCreateAssetTypeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAssetTypeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateAssetTypeMutation, CreateAssetTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateAssetTypeMutation, CreateAssetTypeMutationVariables>(CreateAssetTypeDocument, options);
      }
export type CreateAssetTypeMutationHookResult = ReturnType<typeof useCreateAssetTypeMutation>;
export type CreateAssetTypeMutationResult = Apollo.MutationResult<CreateAssetTypeMutation>;
export type CreateAssetTypeMutationOptions = Apollo.BaseMutationOptions<CreateAssetTypeMutation, CreateAssetTypeMutationVariables>;
export const UpdateAssetTypeDocument = gql`
    mutation UpdateAssetType($id: String!, $input: UpdateAssetTypeInput!) {
  updateAssetType(id: $id, input: $input) {
    id
    name
    unit
    description
    createdAt
  }
}
    `;
export type UpdateAssetTypeMutationFn = Apollo.MutationFunction<UpdateAssetTypeMutation, UpdateAssetTypeMutationVariables>;

/**
 * __useUpdateAssetTypeMutation__
 *
 * To run a mutation, you first call `useUpdateAssetTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAssetTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAssetTypeMutation, { data, loading, error }] = useUpdateAssetTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAssetTypeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateAssetTypeMutation, UpdateAssetTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateAssetTypeMutation, UpdateAssetTypeMutationVariables>(UpdateAssetTypeDocument, options);
      }
export type UpdateAssetTypeMutationHookResult = ReturnType<typeof useUpdateAssetTypeMutation>;
export type UpdateAssetTypeMutationResult = Apollo.MutationResult<UpdateAssetTypeMutation>;
export type UpdateAssetTypeMutationOptions = Apollo.BaseMutationOptions<UpdateAssetTypeMutation, UpdateAssetTypeMutationVariables>;
export const DeleteAssetTypeDocument = gql`
    mutation DeleteAssetType($id: String!) {
  deleteAssetType(id: $id) {
    id
  }
}
    `;
export type DeleteAssetTypeMutationFn = Apollo.MutationFunction<DeleteAssetTypeMutation, DeleteAssetTypeMutationVariables>;

/**
 * __useDeleteAssetTypeMutation__
 *
 * To run a mutation, you first call `useDeleteAssetTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAssetTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAssetTypeMutation, { data, loading, error }] = useDeleteAssetTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAssetTypeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAssetTypeMutation, DeleteAssetTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteAssetTypeMutation, DeleteAssetTypeMutationVariables>(DeleteAssetTypeDocument, options);
      }
export type DeleteAssetTypeMutationHookResult = ReturnType<typeof useDeleteAssetTypeMutation>;
export type DeleteAssetTypeMutationResult = Apollo.MutationResult<DeleteAssetTypeMutation>;
export type DeleteAssetTypeMutationOptions = Apollo.BaseMutationOptions<DeleteAssetTypeMutation, DeleteAssetTypeMutationVariables>;
export const AssetsDocument = gql`
    query Assets {
  assets {
    id
    assetTypeId
    name
    quantity
    purchasePrice
    currentSellPrice
    purchaseDate
    note
    createdAt
    totalValue
    assetType {
      id
      name
      unit
    }
  }
}
    `;

/**
 * __useAssetsQuery__
 *
 * To run a query within a React component, call `useAssetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAssetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAssetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAssetsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AssetsQuery, AssetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AssetsQuery, AssetsQueryVariables>(AssetsDocument, options);
      }
export function useAssetsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AssetsQuery, AssetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AssetsQuery, AssetsQueryVariables>(AssetsDocument, options);
        }
// @ts-ignore
export function useAssetsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<AssetsQuery, AssetsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AssetsQuery, AssetsQueryVariables>;
export function useAssetsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AssetsQuery, AssetsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AssetsQuery | undefined, AssetsQueryVariables>;
export function useAssetsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AssetsQuery, AssetsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AssetsQuery, AssetsQueryVariables>(AssetsDocument, options);
        }
export type AssetsQueryHookResult = ReturnType<typeof useAssetsQuery>;
export type AssetsLazyQueryHookResult = ReturnType<typeof useAssetsLazyQuery>;
export type AssetsSuspenseQueryHookResult = ReturnType<typeof useAssetsSuspenseQuery>;
export type AssetsQueryResult = Apollo.QueryResult<AssetsQuery, AssetsQueryVariables>;
export const AssetDocument = gql`
    query Asset($id: String!) {
  asset(id: $id) {
    id
    assetTypeId
    name
    quantity
    purchasePrice
    currentSellPrice
    purchaseDate
    note
    createdAt
    totalValue
    assetType {
      id
      name
      unit
    }
  }
}
    `;

/**
 * __useAssetQuery__
 *
 * To run a query within a React component, call `useAssetQuery` and pass it any options that fit your needs.
 * When your component renders, `useAssetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAssetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAssetQuery(baseOptions: ApolloReactHooks.QueryHookOptions<AssetQuery, AssetQueryVariables> & ({ variables: AssetQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AssetQuery, AssetQueryVariables>(AssetDocument, options);
      }
export function useAssetLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AssetQuery, AssetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AssetQuery, AssetQueryVariables>(AssetDocument, options);
        }
// @ts-ignore
export function useAssetSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<AssetQuery, AssetQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AssetQuery, AssetQueryVariables>;
export function useAssetSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AssetQuery, AssetQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AssetQuery | undefined, AssetQueryVariables>;
export function useAssetSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AssetQuery, AssetQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AssetQuery, AssetQueryVariables>(AssetDocument, options);
        }
export type AssetQueryHookResult = ReturnType<typeof useAssetQuery>;
export type AssetLazyQueryHookResult = ReturnType<typeof useAssetLazyQuery>;
export type AssetSuspenseQueryHookResult = ReturnType<typeof useAssetSuspenseQuery>;
export type AssetQueryResult = Apollo.QueryResult<AssetQuery, AssetQueryVariables>;
export const CreateAssetDocument = gql`
    mutation CreateAsset($input: CreateAssetInput!) {
  createAsset(input: $input) {
    id
    assetTypeId
    name
    quantity
    purchasePrice
    currentSellPrice
    purchaseDate
    note
    createdAt
    totalValue
    assetType {
      id
      name
      unit
    }
  }
}
    `;
export type CreateAssetMutationFn = Apollo.MutationFunction<CreateAssetMutation, CreateAssetMutationVariables>;

/**
 * __useCreateAssetMutation__
 *
 * To run a mutation, you first call `useCreateAssetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAssetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAssetMutation, { data, loading, error }] = useCreateAssetMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAssetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateAssetMutation, CreateAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateAssetMutation, CreateAssetMutationVariables>(CreateAssetDocument, options);
      }
export type CreateAssetMutationHookResult = ReturnType<typeof useCreateAssetMutation>;
export type CreateAssetMutationResult = Apollo.MutationResult<CreateAssetMutation>;
export type CreateAssetMutationOptions = Apollo.BaseMutationOptions<CreateAssetMutation, CreateAssetMutationVariables>;
export const UpdateAssetDocument = gql`
    mutation UpdateAsset($id: String!, $input: UpdateAssetInput!) {
  updateAsset(id: $id, input: $input) {
    id
    assetTypeId
    name
    quantity
    purchasePrice
    currentSellPrice
    purchaseDate
    note
    createdAt
    totalValue
    assetType {
      id
      name
      unit
    }
  }
}
    `;
export type UpdateAssetMutationFn = Apollo.MutationFunction<UpdateAssetMutation, UpdateAssetMutationVariables>;

/**
 * __useUpdateAssetMutation__
 *
 * To run a mutation, you first call `useUpdateAssetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAssetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAssetMutation, { data, loading, error }] = useUpdateAssetMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAssetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateAssetMutation, UpdateAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateAssetMutation, UpdateAssetMutationVariables>(UpdateAssetDocument, options);
      }
export type UpdateAssetMutationHookResult = ReturnType<typeof useUpdateAssetMutation>;
export type UpdateAssetMutationResult = Apollo.MutationResult<UpdateAssetMutation>;
export type UpdateAssetMutationOptions = Apollo.BaseMutationOptions<UpdateAssetMutation, UpdateAssetMutationVariables>;
export const DeleteAssetDocument = gql`
    mutation DeleteAsset($id: String!) {
  deleteAsset(id: $id) {
    id
  }
}
    `;
export type DeleteAssetMutationFn = Apollo.MutationFunction<DeleteAssetMutation, DeleteAssetMutationVariables>;

/**
 * __useDeleteAssetMutation__
 *
 * To run a mutation, you first call `useDeleteAssetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAssetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAssetMutation, { data, loading, error }] = useDeleteAssetMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAssetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAssetMutation, DeleteAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteAssetMutation, DeleteAssetMutationVariables>(DeleteAssetDocument, options);
      }
export type DeleteAssetMutationHookResult = ReturnType<typeof useDeleteAssetMutation>;
export type DeleteAssetMutationResult = Apollo.MutationResult<DeleteAssetMutation>;
export type DeleteAssetMutationOptions = Apollo.BaseMutationOptions<DeleteAssetMutation, DeleteAssetMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
    accessToken
    user {
      id
      username
      createdAt
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    user {
      id
      username
      createdAt
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    createdAt
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
// @ts-ignore
export function useMeSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<MeQuery, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<MeQuery | undefined, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const CategoriesDocument = gql`
    query Categories($type: String, $isParent: Boolean) {
  categories(type: $type, isParent: $isParent) {
    id
    name
    type
    parentId
    userId
    children {
      id
      name
      type
      parentId
    }
  }
}
    `;

/**
 * __useCategoriesQuery__
 *
 * To run a query within a React component, call `useCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesQuery({
 *   variables: {
 *      type: // value for 'type'
 *      isParent: // value for 'isParent'
 *   },
 * });
 */
export function useCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
      }
export function useCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
// @ts-ignore
export function useCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<CategoriesQuery, CategoriesQueryVariables>;
export function useCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<CategoriesQuery | undefined, CategoriesQueryVariables>;
export function useCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
export type CategoriesQueryHookResult = ReturnType<typeof useCategoriesQuery>;
export type CategoriesLazyQueryHookResult = ReturnType<typeof useCategoriesLazyQuery>;
export type CategoriesSuspenseQueryHookResult = ReturnType<typeof useCategoriesSuspenseQuery>;
export type CategoriesQueryResult = Apollo.QueryResult<CategoriesQuery, CategoriesQueryVariables>;
export const PaginatedCategoriesDocument = gql`
    query PaginatedCategories($pagination: PaginationInput!, $type: String, $isParent: Boolean) {
  paginatedCategories(pagination: $pagination, type: $type, isParent: $isParent) {
    items {
      id
      name
      type
      parentId
      userId
      children {
        id
        name
        type
        parentId
      }
    }
    pageInfo {
      total
      page
      limit
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

/**
 * __usePaginatedCategoriesQuery__
 *
 * To run a query within a React component, call `usePaginatedCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaginatedCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaginatedCategoriesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      type: // value for 'type'
 *      isParent: // value for 'isParent'
 *   },
 * });
 */
export function usePaginatedCategoriesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<PaginatedCategoriesQuery, PaginatedCategoriesQueryVariables> & ({ variables: PaginatedCategoriesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PaginatedCategoriesQuery, PaginatedCategoriesQueryVariables>(PaginatedCategoriesDocument, options);
      }
export function usePaginatedCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PaginatedCategoriesQuery, PaginatedCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PaginatedCategoriesQuery, PaginatedCategoriesQueryVariables>(PaginatedCategoriesDocument, options);
        }
// @ts-ignore
export function usePaginatedCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<PaginatedCategoriesQuery, PaginatedCategoriesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<PaginatedCategoriesQuery, PaginatedCategoriesQueryVariables>;
export function usePaginatedCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<PaginatedCategoriesQuery, PaginatedCategoriesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<PaginatedCategoriesQuery | undefined, PaginatedCategoriesQueryVariables>;
export function usePaginatedCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<PaginatedCategoriesQuery, PaginatedCategoriesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<PaginatedCategoriesQuery, PaginatedCategoriesQueryVariables>(PaginatedCategoriesDocument, options);
        }
export type PaginatedCategoriesQueryHookResult = ReturnType<typeof usePaginatedCategoriesQuery>;
export type PaginatedCategoriesLazyQueryHookResult = ReturnType<typeof usePaginatedCategoriesLazyQuery>;
export type PaginatedCategoriesSuspenseQueryHookResult = ReturnType<typeof usePaginatedCategoriesSuspenseQuery>;
export type PaginatedCategoriesQueryResult = Apollo.QueryResult<PaginatedCategoriesQuery, PaginatedCategoriesQueryVariables>;
export const CategoryDocument = gql`
    query Category($id: String!) {
  category(id: $id) {
    id
    name
    type
    parentId
    userId
    children {
      id
      name
    }
    parent {
      id
      name
    }
  }
}
    `;

/**
 * __useCategoryQuery__
 *
 * To run a query within a React component, call `useCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<CategoryQuery, CategoryQueryVariables> & ({ variables: CategoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<CategoryQuery, CategoryQueryVariables>(CategoryDocument, options);
      }
export function useCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CategoryQuery, CategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<CategoryQuery, CategoryQueryVariables>(CategoryDocument, options);
        }
// @ts-ignore
export function useCategorySuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<CategoryQuery, CategoryQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<CategoryQuery, CategoryQueryVariables>;
export function useCategorySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<CategoryQuery, CategoryQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<CategoryQuery | undefined, CategoryQueryVariables>;
export function useCategorySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<CategoryQuery, CategoryQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<CategoryQuery, CategoryQueryVariables>(CategoryDocument, options);
        }
export type CategoryQueryHookResult = ReturnType<typeof useCategoryQuery>;
export type CategoryLazyQueryHookResult = ReturnType<typeof useCategoryLazyQuery>;
export type CategorySuspenseQueryHookResult = ReturnType<typeof useCategorySuspenseQuery>;
export type CategoryQueryResult = Apollo.QueryResult<CategoryQuery, CategoryQueryVariables>;
export const CreateCategoryDocument = gql`
    mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    id
    name
    type
    parentId
    userId
  }
}
    `;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
  updateCategory(id: $id, input: $input) {
    id
    name
    type
    parentId
    userId
  }
}
    `;
export type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
      }
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($id: String!) {
  deleteCategory(id: $id) {
    id
  }
}
    `;
export type DeleteCategoryMutationFn = Apollo.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, options);
      }
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = Apollo.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const ExpensesDocument = gql`
    query Expenses($startDate: DateTime, $endDate: DateTime, $sort: ExpenseSortInput) {
  expenses(startDate: $startDate, endDate: $endDate, sort: $sort) {
    id
    amount
    date
    note
    categoryId
    userId
    createdAt
    category {
      id
      name
      type
    }
  }
}
    `;

/**
 * __useExpensesQuery__
 *
 * To run a query within a React component, call `useExpensesQuery` and pass it any options that fit your needs.
 * When your component renders, `useExpensesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExpensesQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useExpensesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ExpensesQuery, ExpensesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ExpensesQuery, ExpensesQueryVariables>(ExpensesDocument, options);
      }
export function useExpensesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ExpensesQuery, ExpensesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ExpensesQuery, ExpensesQueryVariables>(ExpensesDocument, options);
        }
// @ts-ignore
export function useExpensesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<ExpensesQuery, ExpensesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<ExpensesQuery, ExpensesQueryVariables>;
export function useExpensesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ExpensesQuery, ExpensesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<ExpensesQuery | undefined, ExpensesQueryVariables>;
export function useExpensesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ExpensesQuery, ExpensesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ExpensesQuery, ExpensesQueryVariables>(ExpensesDocument, options);
        }
export type ExpensesQueryHookResult = ReturnType<typeof useExpensesQuery>;
export type ExpensesLazyQueryHookResult = ReturnType<typeof useExpensesLazyQuery>;
export type ExpensesSuspenseQueryHookResult = ReturnType<typeof useExpensesSuspenseQuery>;
export type ExpensesQueryResult = Apollo.QueryResult<ExpensesQuery, ExpensesQueryVariables>;
export const PaginatedExpensesDocument = gql`
    query PaginatedExpenses($pagination: PaginationInput!, $startDate: DateTime, $endDate: DateTime, $sort: ExpenseSortInput) {
  paginatedExpenses(
    pagination: $pagination
    startDate: $startDate
    endDate: $endDate
    sort: $sort
  ) {
    items {
      id
      amount
      date
      note
      categoryId
      userId
      createdAt
      category {
        id
        name
        type
      }
    }
    pageInfo {
      total
      page
      limit
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

/**
 * __usePaginatedExpensesQuery__
 *
 * To run a query within a React component, call `usePaginatedExpensesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaginatedExpensesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaginatedExpensesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function usePaginatedExpensesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<PaginatedExpensesQuery, PaginatedExpensesQueryVariables> & ({ variables: PaginatedExpensesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PaginatedExpensesQuery, PaginatedExpensesQueryVariables>(PaginatedExpensesDocument, options);
      }
export function usePaginatedExpensesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PaginatedExpensesQuery, PaginatedExpensesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PaginatedExpensesQuery, PaginatedExpensesQueryVariables>(PaginatedExpensesDocument, options);
        }
// @ts-ignore
export function usePaginatedExpensesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<PaginatedExpensesQuery, PaginatedExpensesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<PaginatedExpensesQuery, PaginatedExpensesQueryVariables>;
export function usePaginatedExpensesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<PaginatedExpensesQuery, PaginatedExpensesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<PaginatedExpensesQuery | undefined, PaginatedExpensesQueryVariables>;
export function usePaginatedExpensesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<PaginatedExpensesQuery, PaginatedExpensesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<PaginatedExpensesQuery, PaginatedExpensesQueryVariables>(PaginatedExpensesDocument, options);
        }
export type PaginatedExpensesQueryHookResult = ReturnType<typeof usePaginatedExpensesQuery>;
export type PaginatedExpensesLazyQueryHookResult = ReturnType<typeof usePaginatedExpensesLazyQuery>;
export type PaginatedExpensesSuspenseQueryHookResult = ReturnType<typeof usePaginatedExpensesSuspenseQuery>;
export type PaginatedExpensesQueryResult = Apollo.QueryResult<PaginatedExpensesQuery, PaginatedExpensesQueryVariables>;
export const ExpenseDocument = gql`
    query Expense($id: String!) {
  expense(id: $id) {
    id
    amount
    date
    note
    categoryId
    userId
    createdAt
    category {
      id
      name
    }
  }
}
    `;

/**
 * __useExpenseQuery__
 *
 * To run a query within a React component, call `useExpenseQuery` and pass it any options that fit your needs.
 * When your component renders, `useExpenseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExpenseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useExpenseQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ExpenseQuery, ExpenseQueryVariables> & ({ variables: ExpenseQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ExpenseQuery, ExpenseQueryVariables>(ExpenseDocument, options);
      }
export function useExpenseLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ExpenseQuery, ExpenseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ExpenseQuery, ExpenseQueryVariables>(ExpenseDocument, options);
        }
// @ts-ignore
export function useExpenseSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<ExpenseQuery, ExpenseQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<ExpenseQuery, ExpenseQueryVariables>;
export function useExpenseSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ExpenseQuery, ExpenseQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<ExpenseQuery | undefined, ExpenseQueryVariables>;
export function useExpenseSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ExpenseQuery, ExpenseQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ExpenseQuery, ExpenseQueryVariables>(ExpenseDocument, options);
        }
export type ExpenseQueryHookResult = ReturnType<typeof useExpenseQuery>;
export type ExpenseLazyQueryHookResult = ReturnType<typeof useExpenseLazyQuery>;
export type ExpenseSuspenseQueryHookResult = ReturnType<typeof useExpenseSuspenseQuery>;
export type ExpenseQueryResult = Apollo.QueryResult<ExpenseQuery, ExpenseQueryVariables>;
export const CreateExpenseDocument = gql`
    mutation CreateExpense($input: CreateExpenseInput!) {
  createExpense(input: $input) {
    id
    amount
    date
    note
    categoryId
    userId
    createdAt
  }
}
    `;
export type CreateExpenseMutationFn = Apollo.MutationFunction<CreateExpenseMutation, CreateExpenseMutationVariables>;

/**
 * __useCreateExpenseMutation__
 *
 * To run a mutation, you first call `useCreateExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExpenseMutation, { data, loading, error }] = useCreateExpenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateExpenseMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateExpenseMutation, CreateExpenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateExpenseMutation, CreateExpenseMutationVariables>(CreateExpenseDocument, options);
      }
export type CreateExpenseMutationHookResult = ReturnType<typeof useCreateExpenseMutation>;
export type CreateExpenseMutationResult = Apollo.MutationResult<CreateExpenseMutation>;
export type CreateExpenseMutationOptions = Apollo.BaseMutationOptions<CreateExpenseMutation, CreateExpenseMutationVariables>;
export const UpdateExpenseDocument = gql`
    mutation UpdateExpense($id: String!, $input: UpdateExpenseInput!) {
  updateExpense(id: $id, input: $input) {
    id
    amount
    date
    note
    categoryId
    userId
  }
}
    `;
export type UpdateExpenseMutationFn = Apollo.MutationFunction<UpdateExpenseMutation, UpdateExpenseMutationVariables>;

/**
 * __useUpdateExpenseMutation__
 *
 * To run a mutation, you first call `useUpdateExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExpenseMutation, { data, loading, error }] = useUpdateExpenseMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateExpenseMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateExpenseMutation, UpdateExpenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateExpenseMutation, UpdateExpenseMutationVariables>(UpdateExpenseDocument, options);
      }
export type UpdateExpenseMutationHookResult = ReturnType<typeof useUpdateExpenseMutation>;
export type UpdateExpenseMutationResult = Apollo.MutationResult<UpdateExpenseMutation>;
export type UpdateExpenseMutationOptions = Apollo.BaseMutationOptions<UpdateExpenseMutation, UpdateExpenseMutationVariables>;
export const DeleteExpenseDocument = gql`
    mutation DeleteExpense($id: String!) {
  deleteExpense(id: $id) {
    id
  }
}
    `;
export type DeleteExpenseMutationFn = Apollo.MutationFunction<DeleteExpenseMutation, DeleteExpenseMutationVariables>;

/**
 * __useDeleteExpenseMutation__
 *
 * To run a mutation, you first call `useDeleteExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExpenseMutation, { data, loading, error }] = useDeleteExpenseMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteExpenseMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteExpenseMutation, DeleteExpenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteExpenseMutation, DeleteExpenseMutationVariables>(DeleteExpenseDocument, options);
      }
export type DeleteExpenseMutationHookResult = ReturnType<typeof useDeleteExpenseMutation>;
export type DeleteExpenseMutationResult = Apollo.MutationResult<DeleteExpenseMutation>;
export type DeleteExpenseMutationOptions = Apollo.BaseMutationOptions<DeleteExpenseMutation, DeleteExpenseMutationVariables>;
export const IncomesDocument = gql`
    query Incomes($startDate: DateTime, $endDate: DateTime, $sort: IncomeSortInput) {
  incomes(startDate: $startDate, endDate: $endDate, sort: $sort) {
    id
    amount
    date
    note
    categoryId
    userId
    createdAt
    category {
      id
      name
      type
    }
  }
}
    `;

/**
 * __useIncomesQuery__
 *
 * To run a query within a React component, call `useIncomesQuery` and pass it any options that fit your needs.
 * When your component renders, `useIncomesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIncomesQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useIncomesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IncomesQuery, IncomesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<IncomesQuery, IncomesQueryVariables>(IncomesDocument, options);
      }
export function useIncomesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IncomesQuery, IncomesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<IncomesQuery, IncomesQueryVariables>(IncomesDocument, options);
        }
// @ts-ignore
export function useIncomesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<IncomesQuery, IncomesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<IncomesQuery, IncomesQueryVariables>;
export function useIncomesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<IncomesQuery, IncomesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<IncomesQuery | undefined, IncomesQueryVariables>;
export function useIncomesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<IncomesQuery, IncomesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<IncomesQuery, IncomesQueryVariables>(IncomesDocument, options);
        }
export type IncomesQueryHookResult = ReturnType<typeof useIncomesQuery>;
export type IncomesLazyQueryHookResult = ReturnType<typeof useIncomesLazyQuery>;
export type IncomesSuspenseQueryHookResult = ReturnType<typeof useIncomesSuspenseQuery>;
export type IncomesQueryResult = Apollo.QueryResult<IncomesQuery, IncomesQueryVariables>;
export const PaginatedIncomesDocument = gql`
    query PaginatedIncomes($pagination: PaginationInput!, $startDate: DateTime, $endDate: DateTime, $sort: IncomeSortInput) {
  paginatedIncomes(
    pagination: $pagination
    startDate: $startDate
    endDate: $endDate
    sort: $sort
  ) {
    items {
      id
      amount
      date
      note
      categoryId
      userId
      createdAt
      category {
        id
        name
        type
      }
    }
    pageInfo {
      total
      page
      limit
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

/**
 * __usePaginatedIncomesQuery__
 *
 * To run a query within a React component, call `usePaginatedIncomesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaginatedIncomesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaginatedIncomesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function usePaginatedIncomesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<PaginatedIncomesQuery, PaginatedIncomesQueryVariables> & ({ variables: PaginatedIncomesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PaginatedIncomesQuery, PaginatedIncomesQueryVariables>(PaginatedIncomesDocument, options);
      }
export function usePaginatedIncomesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PaginatedIncomesQuery, PaginatedIncomesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PaginatedIncomesQuery, PaginatedIncomesQueryVariables>(PaginatedIncomesDocument, options);
        }
// @ts-ignore
export function usePaginatedIncomesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<PaginatedIncomesQuery, PaginatedIncomesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<PaginatedIncomesQuery, PaginatedIncomesQueryVariables>;
export function usePaginatedIncomesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<PaginatedIncomesQuery, PaginatedIncomesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<PaginatedIncomesQuery | undefined, PaginatedIncomesQueryVariables>;
export function usePaginatedIncomesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<PaginatedIncomesQuery, PaginatedIncomesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<PaginatedIncomesQuery, PaginatedIncomesQueryVariables>(PaginatedIncomesDocument, options);
        }
export type PaginatedIncomesQueryHookResult = ReturnType<typeof usePaginatedIncomesQuery>;
export type PaginatedIncomesLazyQueryHookResult = ReturnType<typeof usePaginatedIncomesLazyQuery>;
export type PaginatedIncomesSuspenseQueryHookResult = ReturnType<typeof usePaginatedIncomesSuspenseQuery>;
export type PaginatedIncomesQueryResult = Apollo.QueryResult<PaginatedIncomesQuery, PaginatedIncomesQueryVariables>;
export const IncomeDocument = gql`
    query Income($id: String!) {
  income(id: $id) {
    id
    amount
    date
    note
    categoryId
    userId
    createdAt
    category {
      id
      name
    }
  }
}
    `;

/**
 * __useIncomeQuery__
 *
 * To run a query within a React component, call `useIncomeQuery` and pass it any options that fit your needs.
 * When your component renders, `useIncomeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIncomeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useIncomeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<IncomeQuery, IncomeQueryVariables> & ({ variables: IncomeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<IncomeQuery, IncomeQueryVariables>(IncomeDocument, options);
      }
export function useIncomeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IncomeQuery, IncomeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<IncomeQuery, IncomeQueryVariables>(IncomeDocument, options);
        }
// @ts-ignore
export function useIncomeSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<IncomeQuery, IncomeQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<IncomeQuery, IncomeQueryVariables>;
export function useIncomeSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<IncomeQuery, IncomeQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<IncomeQuery | undefined, IncomeQueryVariables>;
export function useIncomeSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<IncomeQuery, IncomeQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<IncomeQuery, IncomeQueryVariables>(IncomeDocument, options);
        }
export type IncomeQueryHookResult = ReturnType<typeof useIncomeQuery>;
export type IncomeLazyQueryHookResult = ReturnType<typeof useIncomeLazyQuery>;
export type IncomeSuspenseQueryHookResult = ReturnType<typeof useIncomeSuspenseQuery>;
export type IncomeQueryResult = Apollo.QueryResult<IncomeQuery, IncomeQueryVariables>;
export const CreateIncomeDocument = gql`
    mutation CreateIncome($input: CreateIncomeInput!) {
  createIncome(input: $input) {
    id
    amount
    date
    note
    categoryId
    userId
    createdAt
  }
}
    `;
export type CreateIncomeMutationFn = Apollo.MutationFunction<CreateIncomeMutation, CreateIncomeMutationVariables>;

/**
 * __useCreateIncomeMutation__
 *
 * To run a mutation, you first call `useCreateIncomeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateIncomeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createIncomeMutation, { data, loading, error }] = useCreateIncomeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateIncomeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateIncomeMutation, CreateIncomeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateIncomeMutation, CreateIncomeMutationVariables>(CreateIncomeDocument, options);
      }
export type CreateIncomeMutationHookResult = ReturnType<typeof useCreateIncomeMutation>;
export type CreateIncomeMutationResult = Apollo.MutationResult<CreateIncomeMutation>;
export type CreateIncomeMutationOptions = Apollo.BaseMutationOptions<CreateIncomeMutation, CreateIncomeMutationVariables>;
export const UpdateIncomeDocument = gql`
    mutation UpdateIncome($id: String!, $input: UpdateIncomeInput!) {
  updateIncome(id: $id, input: $input) {
    id
    amount
    date
    note
    categoryId
    userId
  }
}
    `;
export type UpdateIncomeMutationFn = Apollo.MutationFunction<UpdateIncomeMutation, UpdateIncomeMutationVariables>;

/**
 * __useUpdateIncomeMutation__
 *
 * To run a mutation, you first call `useUpdateIncomeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateIncomeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateIncomeMutation, { data, loading, error }] = useUpdateIncomeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateIncomeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateIncomeMutation, UpdateIncomeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateIncomeMutation, UpdateIncomeMutationVariables>(UpdateIncomeDocument, options);
      }
export type UpdateIncomeMutationHookResult = ReturnType<typeof useUpdateIncomeMutation>;
export type UpdateIncomeMutationResult = Apollo.MutationResult<UpdateIncomeMutation>;
export type UpdateIncomeMutationOptions = Apollo.BaseMutationOptions<UpdateIncomeMutation, UpdateIncomeMutationVariables>;
export const DeleteIncomeDocument = gql`
    mutation DeleteIncome($id: String!) {
  deleteIncome(id: $id) {
    id
  }
}
    `;
export type DeleteIncomeMutationFn = Apollo.MutationFunction<DeleteIncomeMutation, DeleteIncomeMutationVariables>;

/**
 * __useDeleteIncomeMutation__
 *
 * To run a mutation, you first call `useDeleteIncomeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteIncomeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteIncomeMutation, { data, loading, error }] = useDeleteIncomeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteIncomeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteIncomeMutation, DeleteIncomeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteIncomeMutation, DeleteIncomeMutationVariables>(DeleteIncomeDocument, options);
      }
export type DeleteIncomeMutationHookResult = ReturnType<typeof useDeleteIncomeMutation>;
export type DeleteIncomeMutationResult = Apollo.MutationResult<DeleteIncomeMutation>;
export type DeleteIncomeMutationOptions = Apollo.BaseMutationOptions<DeleteIncomeMutation, DeleteIncomeMutationVariables>;
export const ReportStatisticsDocument = gql`
    query ReportStatistics($range: String!, $referenceDate: DateTime) {
  reportStatistics(range: $range, referenceDate: $referenceDate) {
    totalIncome
    totalExpense
    balance
    totalAssets
    totalValue
    startDate
    endDate
    expenseByCategory {
      categoryId
      categoryName
      count
      total
    }
    incomeByCategory {
      categoryId
      categoryName
      count
      total
    }
  }
}
    `;

/**
 * __useReportStatisticsQuery__
 *
 * To run a query within a React component, call `useReportStatisticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useReportStatisticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReportStatisticsQuery({
 *   variables: {
 *      range: // value for 'range'
 *      referenceDate: // value for 'referenceDate'
 *   },
 * });
 */
export function useReportStatisticsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ReportStatisticsQuery, ReportStatisticsQueryVariables> & ({ variables: ReportStatisticsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ReportStatisticsQuery, ReportStatisticsQueryVariables>(ReportStatisticsDocument, options);
      }
export function useReportStatisticsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ReportStatisticsQuery, ReportStatisticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ReportStatisticsQuery, ReportStatisticsQueryVariables>(ReportStatisticsDocument, options);
        }
// @ts-ignore
export function useReportStatisticsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<ReportStatisticsQuery, ReportStatisticsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<ReportStatisticsQuery, ReportStatisticsQueryVariables>;
export function useReportStatisticsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ReportStatisticsQuery, ReportStatisticsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<ReportStatisticsQuery | undefined, ReportStatisticsQueryVariables>;
export function useReportStatisticsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ReportStatisticsQuery, ReportStatisticsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ReportStatisticsQuery, ReportStatisticsQueryVariables>(ReportStatisticsDocument, options);
        }
export type ReportStatisticsQueryHookResult = ReturnType<typeof useReportStatisticsQuery>;
export type ReportStatisticsLazyQueryHookResult = ReturnType<typeof useReportStatisticsLazyQuery>;
export type ReportStatisticsSuspenseQueryHookResult = ReturnType<typeof useReportStatisticsSuspenseQuery>;
export type ReportStatisticsQueryResult = Apollo.QueryResult<ReportStatisticsQuery, ReportStatisticsQueryVariables>;
export const OverallTotalValueDocument = gql`
    query OverallTotalValue {
  overallTotalValue {
    totalValue
    totalIncome
    totalExpense
    totalAssets
  }
}
    `;

/**
 * __useOverallTotalValueQuery__
 *
 * To run a query within a React component, call `useOverallTotalValueQuery` and pass it any options that fit your needs.
 * When your component renders, `useOverallTotalValueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOverallTotalValueQuery({
 *   variables: {
 *   },
 * });
 */
export function useOverallTotalValueQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<OverallTotalValueQuery, OverallTotalValueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<OverallTotalValueQuery, OverallTotalValueQueryVariables>(OverallTotalValueDocument, options);
      }
export function useOverallTotalValueLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<OverallTotalValueQuery, OverallTotalValueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<OverallTotalValueQuery, OverallTotalValueQueryVariables>(OverallTotalValueDocument, options);
        }
// @ts-ignore
export function useOverallTotalValueSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<OverallTotalValueQuery, OverallTotalValueQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<OverallTotalValueQuery, OverallTotalValueQueryVariables>;
export function useOverallTotalValueSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<OverallTotalValueQuery, OverallTotalValueQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<OverallTotalValueQuery | undefined, OverallTotalValueQueryVariables>;
export function useOverallTotalValueSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<OverallTotalValueQuery, OverallTotalValueQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<OverallTotalValueQuery, OverallTotalValueQueryVariables>(OverallTotalValueDocument, options);
        }
export type OverallTotalValueQueryHookResult = ReturnType<typeof useOverallTotalValueQuery>;
export type OverallTotalValueLazyQueryHookResult = ReturnType<typeof useOverallTotalValueLazyQuery>;
export type OverallTotalValueSuspenseQueryHookResult = ReturnType<typeof useOverallTotalValueSuspenseQuery>;
export type OverallTotalValueQueryResult = Apollo.QueryResult<OverallTotalValueQuery, OverallTotalValueQueryVariables>;
export const UserSettingsDocument = gql`
    query UserSettings {
  userSettings {
    id
    userId
    theme
    language
    currency
    updatedAt
  }
}
    `;

/**
 * __useUserSettingsQuery__
 *
 * To run a query within a React component, call `useUserSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserSettingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserSettingsQuery, UserSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<UserSettingsQuery, UserSettingsQueryVariables>(UserSettingsDocument, options);
      }
export function useUserSettingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserSettingsQuery, UserSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<UserSettingsQuery, UserSettingsQueryVariables>(UserSettingsDocument, options);
        }
// @ts-ignore
export function useUserSettingsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<UserSettingsQuery, UserSettingsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<UserSettingsQuery, UserSettingsQueryVariables>;
export function useUserSettingsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<UserSettingsQuery, UserSettingsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<UserSettingsQuery | undefined, UserSettingsQueryVariables>;
export function useUserSettingsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<UserSettingsQuery, UserSettingsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<UserSettingsQuery, UserSettingsQueryVariables>(UserSettingsDocument, options);
        }
export type UserSettingsQueryHookResult = ReturnType<typeof useUserSettingsQuery>;
export type UserSettingsLazyQueryHookResult = ReturnType<typeof useUserSettingsLazyQuery>;
export type UserSettingsSuspenseQueryHookResult = ReturnType<typeof useUserSettingsSuspenseQuery>;
export type UserSettingsQueryResult = Apollo.QueryResult<UserSettingsQuery, UserSettingsQueryVariables>;
export const UpdateUserSettingsDocument = gql`
    mutation UpdateUserSettings($input: UpdateSettingInput!) {
  updateUserSettings(input: $input) {
    id
    userId
    theme
    language
    currency
    updatedAt
  }
}
    `;
export type UpdateUserSettingsMutationFn = Apollo.MutationFunction<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>;

/**
 * __useUpdateUserSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateUserSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserSettingsMutation, { data, loading, error }] = useUpdateUserSettingsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserSettingsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>(UpdateUserSettingsDocument, options);
      }
export type UpdateUserSettingsMutationHookResult = ReturnType<typeof useUpdateUserSettingsMutation>;
export type UpdateUserSettingsMutationResult = Apollo.MutationResult<UpdateUserSettingsMutation>;
export type UpdateUserSettingsMutationOptions = Apollo.BaseMutationOptions<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>;