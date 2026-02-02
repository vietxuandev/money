import React, { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  useUpdateUserSettingsMutation,
  useUserSettingsQuery,
  type Currency,
  type Theme,
  type UpdateSettingInput,
} from "../generated/graphql";
import { useAuth } from "../hooks/useAuth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { SettingsContext } from "./settings-context";

interface StoredSettings {
  theme: Theme;
  language: string;
  currency: Currency;
}

const SETTINGS_STORAGE_KEY = "userSettings";

const DEFAULT_SETTINGS: StoredSettings = {
  theme: "LIGHT",
  language: "en",
  currency: "USD",
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { i18n } = useTranslation();

  // Use localStorage hook for persistent storage
  const [storedSettings, setStoredSettings] = useLocalStorage<StoredSettings>(
    SETTINGS_STORAGE_KEY,
    DEFAULT_SETTINGS,
  );

  const [theme, setTheme] = useState<Theme>(storedSettings.theme);
  const [language, setLanguage] = useState<string>(storedSettings.language);
  const [currency, setCurrency] = useState<Currency>(storedSettings.currency);

  const { data, loading } = useUserSettingsQuery({
    skip: !user,
    fetchPolicy: "network-only",
    onError: (error) => {
      console.error("Failed to fetch user settings:", error);
      // Don't crash the app, just use local storage settings
    },
  });

  const [updateSettingsMutation] = useUpdateUserSettingsMutation();

  // Update settings when API data arrives
  useEffect(() => {
    if (data?.userSettings) {
      const settings = data.userSettings;
      setTheme(settings.theme);
      setLanguage(settings.language);
      setCurrency(settings.currency);

      // Change language if different
      if (i18n.language !== settings.language) {
        i18n.changeLanguage(settings.language);
      }

      // Save to localStorage using hook
      setStoredSettings({
        theme: settings.theme,
        language: settings.language,
        currency: settings.currency,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, i18n.language]);

  // Apply language on mount from stored settings
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === "DARK") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const updateSettings = async (input: UpdateSettingInput) => {
    try {
      const { data: updateData } = await updateSettingsMutation({
        variables: { input },
      });

      if (updateData?.updateUserSettings) {
        const settings = updateData.updateUserSettings;
        setTheme(settings.theme);
        setLanguage(settings.language);
        setCurrency(settings.currency);

        if (settings.language) {
          i18n.changeLanguage(settings.language);
        }

        // Save to localStorage using hook
        setStoredSettings({
          theme: settings.theme,
          language: settings.language,
          currency: settings.currency,
        });
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        language,
        currency,
        isLoading: loading,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
