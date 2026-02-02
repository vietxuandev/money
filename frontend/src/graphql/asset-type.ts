import { gql } from "@apollo/client";

export const ASSET_TYPES_QUERY = gql`
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

export const ASSET_TYPE_QUERY = gql`
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

export const CREATE_ASSET_TYPE_MUTATION = gql`
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

export const UPDATE_ASSET_TYPE_MUTATION = gql`
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

export const DELETE_ASSET_TYPE_MUTATION = gql`
  mutation DeleteAssetType($id: String!) {
    deleteAssetType(id: $id) {
      id
    }
  }
`;
