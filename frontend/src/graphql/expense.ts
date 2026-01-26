import { gql } from "@apollo/client";

export const GET_EXPENSES = gql`
  query Expenses($startDate: DateTime, $endDate: DateTime) {
    expenses(startDate: $startDate, endDate: $endDate) {
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
