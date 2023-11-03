import SettingsLayout from "@/components/Layouts/Settings.layout";
import SubscriptionPage from "@/pageContainers/Home/Settings/SubscriptionPage.home.settings";
import React from "react";

const subscription = () => {
  return (
    <SettingsLayout>
      <SubscriptionPage />
    </SettingsLayout>
  );
};

export default subscription;
