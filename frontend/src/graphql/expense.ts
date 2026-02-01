import { gql } from "@apollo/client";

export const GET_EXPENSES = gql`
  query Expenses(
    $startDate: DateTime
    $endDate: DateTime
    $sort: ExpenseSortInput
  ) {
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

export const GET_PAGINATED_EXPENSES = gql`
  query PaginatedExpenses(
    $pagination: PaginationInput!
    $startDate: DateTime
    $endDate: DateTime
    $sort: ExpenseSortInput
  ) {
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

export const GET_EXPENSE = gql`
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

export const CREATE_EXPENSE = gql`
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

export const UPDATE_EXPENSE = gql`
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

export const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: String!) {
    deleteExpense(id: $id) {
      id
    }
  }
`;
