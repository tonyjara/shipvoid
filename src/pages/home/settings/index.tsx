import SettingsLayout from "@/components/Layouts/Settings.layout";
import { manageSubscription } from "@/lib/utils/SubscriptionManagementUtils";
import ProfileSettingsPage from "@/pageContainers/Home/Settings/ProfileSettings.home.settings";
import { getServerAuthSession } from "@/server/auth";
import { GetServerSideProps } from "next";
import React from "react";

const index = () => {
  return (
    <SettingsLayout>
      <ProfileSettingsPage />
    </SettingsLayout>
  );
};

export default index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  const subManager = await manageSubscription(session?.user.id);

  return (
    subManager ?? {
      props: {},
    }
  );
};
