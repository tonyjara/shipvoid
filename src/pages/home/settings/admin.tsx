import SettingsLayout from "@/components/Layouts/Settings.layout";
import AdminPage from "@/pages/admin";
import React from "react";

const admin = () => {
  return (
    <SettingsLayout>
      <AdminPage />
    </SettingsLayout>
  );
};

export default admin;
