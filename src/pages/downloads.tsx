import HtmlParser from "@/components/HtmlParser";
import { downloadRelease } from "@/pageContainers/Admin/Releases/release.utils";
import {
  Button,
  Card,
  Text,
  CardHeader,
  CardBody,
  Divider,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import React from "react";
import PageContainer from "@/components/Containers/PageContainer";
import { trpcClient } from "@/utils/api";
import { BiCalendar } from "react-icons/bi";
import { format } from "date-fns";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/db";

const DownloadsPage = () => {
  const { data: transcribelyReleases, isLoading } =
    trpcClient.releases.getManyByTagThatIvePurchased.useQuery({
      platformProductName: "TRANSCRIBELY",
    });
  return (
    <PageContainer className="flex flex-col items-center">
      <Tabs maxW={"800px"} w="full" overflow={"auto"}>
        <Flex
          flexDir={{ base: "column", lg: "row" }}
          alignItems={{ base: "start", lg: "center" }}
          gap={"20px"}
        >
          <Text fontWeight={"bold"} fontSize={{ base: "2xl", md: "3xl" }}>
            Releases
          </Text>

          <TabList px={"10px"}>
            <Tab>Transcribely</Tab>
            {/* <Tab>{PlatformProduct.COMPONENTS_PACK}</Tab> */}
          </TabList>
        </Flex>
        <TabPanels minH={"90vh"}>
          <TabPanel>
            {/* TRANSCRIBELY */}
            <Flex flexDir={"column"} gap="20px">
              {transcribelyReleases?.map((release, i) => {
                const getDownloadUrl = async () => {
                  await downloadRelease({
                    platformProductName: release.platformProductName,
                    release,
                  });
                };

                return (
                  <Card variant={"outline"} key={release.id}>
                    <CardHeader fontWeight={"bold"} fontSize={"2xl"}>
                      <Flex justifyContent={"space-between"}>
                        {release.title}
                        <Flex gap={"10px"}>
                          <Tag
                            hidden={i !== 0}
                            size={"sm"}
                            variant="subtle"
                            colorScheme="orange"
                          >
                            <TagLabel>Latest</TagLabel>
                          </Tag>
                          <Tag size={"sm"} variant="subtle" colorScheme="cyan">
                            <TagLeftIcon as={BiCalendar} />
                            <TagLabel>
                              {format(release.createdAt, "MM/dd/yy")}
                            </TagLabel>
                          </Tag>
                        </Flex>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <HtmlParser content={release.content} />
                    </CardBody>
                    <Divider mt={"20px"} />
                    <Flex m={"20px"} gap="20px">
                      <Button
                        disabled={isLoading}
                        onClick={getDownloadUrl}
                        w="fit-content"
                      >
                        Download
                      </Button>
                    </Flex>
                  </Card>
                );
              })}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
};

export default DownloadsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }

  const userHasSomePurchasedProduct = await prisma.purchaseIntent.findFirst({
    where: {
      userId: session.user.id,
      succeeded: true,
      platformProductName: "TRANSCRIBELY",
    },
  });

  if (!userHasSomePurchasedProduct) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};
