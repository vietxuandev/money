import { gql } from "@apollo/client";

export const USER_SETTINGS = gql`
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

export const UPDATE_USER_SETTINGS = gql`
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
