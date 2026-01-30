import { createContext } from "react";
import type { Theme, Currency, UpdateSettingInput } from "../generated/graphql";

export interface SettingsContextType {
  theme: Theme;
  language: string;
  currency: Currency;
  isLoading: boolean;
  updateSettings: (settings: UpdateSettingInput) => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);
