import { gql } from "@apollo/client";

export const GET_INCOMES = gql`
  query Incomes($startDate: DateTime, $endDate: DateTime) {
    incomes(startDate: $startDate, endDate: $endDate) {
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

export const GET_INCOME = gql`
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

export const CREATE_INCOME = gql`
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

export const UPDATE_INCOME = gql`
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

export const DELETE_INCOME = gql`
  mutation DeleteIncome($id: String!) {
    deleteIncome(id: $id) {
      id
    }
  }
`;
