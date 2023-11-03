import SettingsLayout from "@/components/Layouts/Settings.layout";
import PreferencesPage from "@/pageContainers/Home/Settings/PreferencesPage.home.settings";
import React from "react";

const preferences = () => {
  return (
    <SettingsLayout>
      <PreferencesPage />
    </SettingsLayout>
  );
};

export default preferences;
