import { createContext } from "react";
import {
  type Currency,
  type Theme,
  type UpdateSettingInput,
} from "../generated/graphql";
interface SettingsContextType {
  theme: Theme;
  language: string;
  currency: Currency;
  isLoading: boolean;
  updateSettings: (settings: UpdateSettingInput) => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);
