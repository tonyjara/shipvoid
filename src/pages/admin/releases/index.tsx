import PageContainer from "@/components/Containers/PageContainer";
import AdminReleasesPage from "@/pageContainers/Admin/Releases/AdminReleasesPage";
import {
  Tabs,
  Text,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import { PlatformProduct } from "@prisma/client";
import React from "react";

const Releases = () => {
  return (
    <PageContainer>
      <Tabs overflow={"auto"}>
        <Flex
          flexDir={{ base: "column", lg: "row" }}
          alignItems={{ base: "start", lg: "center" }}
          gap={"20px"}
        >
          <Text fontWeight={"bold"} fontSize={{ base: "2xl", md: "3xl" }}>
            Releases
          </Text>

          <TabList px={"10px"}>
            <Tab>{PlatformProduct.TRANSCRIBELY}</Tab>
            <Tab>{PlatformProduct.COMPONENTS_PACK}</Tab>
          </TabList>
        </Flex>
        <TabPanels>
          <TabPanel>
            <AdminReleasesPage platformProductName="TRANSCRIBELY" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
};

export default Releases;
