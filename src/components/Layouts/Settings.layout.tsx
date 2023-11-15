import { useColorModeValue, Tabs, TabList, Tab, Box } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const backgroundColor = useColorModeValue("white", "gray.800");
  const router = useRouter();

  const routesDict = {
    "/home/settigs": 0,
    "/home/settings/preferences": 1,
    "/home/settings/usage": 2,
  };
  useEffect(() => {
    //@ts-ignore
    setTabIndex(routesDict[router.asPath]);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  return (
    <Tabs index={tabIndex} w={"100%"}>
      <TabList pb={"10px"} overflowX={"auto"} overflowY="hidden">
        <Link href={"/home/settings"}>
          <Tab whiteSpace={"nowrap"}>Profile</Tab>
        </Link>
      </TabList>

      <Box backgroundColor={backgroundColor} borderRadius="8px">
        <Box>{children}</Box>
      </Box>
    </Tabs>
  );
};

export default SettingsLayout;
