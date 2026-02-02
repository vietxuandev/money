import { gql } from "@apollo/client";

export const ASSETS_QUERY = gql`
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

export const ASSET_QUERY = gql`
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

export const CREATE_ASSET_MUTATION = gql`
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

export const UPDATE_ASSET_MUTATION = gql`
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

export const DELETE_ASSET_MUTATION = gql`
  mutation DeleteAsset($id: String!) {
    deleteAsset(id: $id) {
      id
    }
  }
`;
