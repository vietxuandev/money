import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
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

export const GET_PAGINATED_CATEGORIES = gql`
  query PaginatedCategories(
    $pagination: PaginationInput!
    $type: String
    $isParent: Boolean
  ) {
    paginatedCategories(
      pagination: $pagination
      type: $type
      isParent: $isParent
    ) {
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

export const GET_CATEGORY = gql`
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

export const CREATE_CATEGORY = gql`
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

export const UPDATE_CATEGORY = gql`
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

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;
