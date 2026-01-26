# GraphQL Code Generator Integration Guide

## Overview

This guide explains how to use GraphQL Code Generator with your Personal Finance Manager application to automatically generate TypeScript types from your GraphQL schema.

## What is GraphQL Code Generator?

GraphQL Code Generator (@graphql-codegen/cli) is a tool that automatically generates TypeScript types, React hooks, and other code based on your GraphQL schema and operations. This ensures:

- ✅ Type safety between frontend and backend
- ✅ Auto-completion in your IDE
- ✅ Automatic detection of schema changes
- ✅ Reduced boilerplate code
- ✅ Compile-time error detection

## Installation (Already Done)

The following packages have been installed:

```json
{
  "@graphql-codegen/cli": "^5.0.4",
  "@graphql-codegen/typescript": "^4.1.2",
  "@graphql-codegen/typescript-operations": "^4.4.2",
  "@graphql-codegen/typescript-react-apollo": "^4.3.2"
}
```

## Configuration

### codegen.ts

The configuration file at `frontend/codegen.ts`:

```typescript
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql", // Your GraphQL endpoint
  documents: ["src/**/*.{ts,tsx}"], // Your GraphQL operations
  generates: {
    "./src/generated/graphql.ts": {
      // Output file
      plugins: [
        "typescript", // Generate TypeScript types
        "typescript-operations", // Generate operation types
        "typescript-react-apollo", // Generate React hooks
      ],
      config: {
        withHooks: true, // Generate useQuery, useMutation hooks
        withHOC: false,
        withComponent: false,
      },
    },
  },
};

export default config;
```

### package.json Script

```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts"
  }
}
```

## How to Use

### Step 1: Start Your Backend

The GraphQL Code Generator needs to connect to your running GraphQL server to introspect the schema.

```bash
cd backend
npm run start:dev
```

Verify the backend is running by visiting: http://localhost:4000/graphql

### Step 2: Run Code Generation

```bash
cd frontend
npm run codegen
```

This will:

1. Connect to http://localhost:4000/graphql
2. Fetch the complete GraphQL schema
3. Find all GraphQL operations in your `src/` directory
4. Generate TypeScript types and React hooks
5. Save everything to `src/generated/graphql.ts`

### Step 3: Use Generated Types and Hooks

#### Before (Manual Types):

```typescript
import { useQuery, useMutation } from "@apollo/client";
import { GET_EXPENSES, CREATE_EXPENSE } from "../graphql/expense";

// Manual type definition
type Expense = {
  id: string;
  amount: number;
  date: string;
  note?: string;
  category?: Category;
};

function ExpensesPage() {
  const { data } = useQuery(GET_EXPENSES);
  const [createExpense] = useMutation(CREATE_EXPENSE);

  const expenses = data?.expenses as Expense[] | undefined;
}
```

#### After (Generated Types):

```typescript
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  Expense,
  Category,
} from "../generated/graphql";

function ExpensesPage() {
  const { data } = useGetExpensesQuery();
  const [createExpense] = useCreateExpenseMutation();

  // expenses is automatically typed as Expense[]
  const expenses = data?.expenses;
}
```

## Generated Code Structure

The generated `src/generated/graphql.ts` file contains:

### 1. Scalar Types

```typescript
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  DateTime: { input: string; output: string };
  // ... more scalars
};
```

### 2. Object Types

```typescript
export type User = {
  __typename?: "User";
  id: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
};

export type Expense = {
  __typename?: "Expense";
  id: Scalars["String"]["output"];
  amount: Scalars["Float"]["output"];
  date: Scalars["DateTime"]["output"];
  note?: Maybe<Scalars["String"]["output"]>;
  category?: Maybe<Category>;
  userId: Scalars["String"]["output"];
  categoryId: Scalars["String"]["output"];
};
```

### 3. Input Types

```typescript
export type CreateExpenseInput = {
  amount: Scalars["Float"]["input"];
  categoryId: Scalars["String"]["input"];
  date: Scalars["DateTime"]["input"];
  note?: InputMaybe<Scalars["String"]["input"]>;
};
```

### 4. Operation Types

```typescript
export type GetExpensesQueryVariables = Exact<{ [key: string]: never }>;

export type GetExpensesQuery = {
  __typename?: "Query";
  expenses: Array<{
    __typename?: "Expense";
    id: string;
    amount: number;
    date: string;
    note?: string | null;
    category?: { __typename?: "Category"; name: string } | null;
  }>;
};
```

### 5. React Hooks

```typescript
export function useGetExpensesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetExpensesQuery,
    GetExpensesQueryVariables
  >,
) {
  // ... implementation
}

export function useCreateExpenseMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateExpenseMutation,
    CreateExpenseMutationVariables
  >,
) {
  // ... implementation
}
```

## GraphQL Operations Format

For the code generator to find your operations, write them like this:

```typescript
import { gql } from "@apollo/client";

export const GET_EXPENSES = gql`
  query GetExpenses {
    expenses {
      id
      amount
      date
      note
      categoryId
      category {
        id
        name
      }
    }
  }
`;

export const CREATE_EXPENSE = gql`
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
      amount
      date
    }
  }
`;
```

The operation names (`GetExpenses`, `CreateExpense`) will be used to generate the hook names:

- `GetExpenses` → `useGetExpensesQuery`
- `CreateExpense` → `useCreateExpenseMutation`

## Best Practices

### 1. Run Codegen After Schema Changes

Whenever you modify your backend schema:

```bash
npm run codegen
```

### 2. Add to Git Pre-commit Hook (Optional)

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run codegen && git add src/generated/graphql.ts"
    }
  }
}
```

### 3. Watch Mode for Development

For automatic regeneration:

```bash
npm run codegen -- --watch
```

### 4. Named Operations

Always name your GraphQL operations:

```typescript
// ✅ Good - Named operation
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }
`;

// ❌ Bad - Anonymous operation
const GET_USER = gql`
  query ($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }
`;
```

### 5. Fragment Usage

Define reusable fragments:

```typescript
export const EXPENSE_FRAGMENT = gql`
  fragment ExpenseFields on Expense {
    id
    amount
    date
    note
    category {
      id
      name
    }
  }
`;

export const GET_EXPENSES = gql`
  ${EXPENSE_FRAGMENT}
  query GetExpenses {
    expenses {
      ...ExpenseFields
    }
  }
`;
```

## Troubleshooting

### Error: Cannot connect to GraphQL endpoint

**Problem**: `connect ECONNREFUSED 127.0.0.1:4000`

**Solution**: Make sure your backend is running:

```bash
cd backend
npm run start:dev
```

### Error: Module has no exported member

**Problem**: TypeScript can't find generated types

**Solution**:

1. Run `npm run codegen` first
2. Restart TypeScript server in VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### Types are out of date

**Solution**: Regenerate types

```bash
npm run codegen
```

### Generated file has errors

**Solution**:

1. Check your GraphQL operations for syntax errors
2. Verify backend schema is correct
3. Delete `src/generated/graphql.ts` and regenerate

## Integration with Your Current Setup

### Manual Types (Current)

Right now, you have manually created types in `src/generated/graphql.ts`. This works but requires:

- Manual updates when schema changes
- No automatic hook generation
- Possible type mismatches

### After Running Codegen

After running `npm run codegen`, the file will be replaced with:

- Auto-generated types matching your backend schema
- Typed hooks for all your operations
- 100% type safety
- Auto-completion

## Example: Complete Migration

### Before:

```typescript
// src/pages/ExpensesPage.tsx
import { useQuery, useMutation } from "@apollo/client";
import { GET_EXPENSES, CREATE_EXPENSE } from "../graphql/expense";
import type { Expense } from "../generated/graphql";

function ExpensesPage() {
  const { data } = useQuery(GET_EXPENSES);
  const [createExpense] = useMutation(CREATE_EXPENSE);

  const expenses: Expense[] = data?.expenses || [];
}
```

### After:

```typescript
// src/pages/ExpensesPage.tsx
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  type Expense,
  type CreateExpenseInput,
} from "../generated/graphql";

function ExpensesPage() {
  const { data, loading, error } = useGetExpensesQuery();
  const [createExpense] = useCreateExpenseMutation();

  // Fully typed, with autocomplete!
  const expenses = data?.expenses || [];
}
```

## Summary

✅ **Installed**: All required packages  
✅ **Configured**: codegen.ts with proper settings  
✅ **Ready**: Just need to start backend and run `npm run codegen`

Next steps:

1. Start your backend: `cd backend && npm run start:dev`
2. Generate types: `cd frontend && npm run codegen`
3. Use the generated hooks in your components
4. Enjoy full type safety! 🎉
