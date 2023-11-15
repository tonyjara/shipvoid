import { trpcClient } from "@/utils/api";
import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { downloadRelease } from "@/pageContainers/Admin/Releases/release.utils";
import Link from "next/link";

const TranscribelyPurchasedHeroButtons = () => {
  const { data: latest, isLoading } =
    trpcClient.releases.getLatestReleaseByTag.useQuery({
      platformProductName: "TRANSCRIBELY",
    });
  const handleDownLoadLatest = async () => {
    if (!latest) return;
    await downloadRelease({
      platformProductName: latest.platformProductName,
      release: latest,
    });
  };

  return (
    <Flex w="full" justify={{ base: "center", lg: "start" }} gap={"20px"}>
      <Flex flexDir={"column"} alignItems={{ base: "center", xl: "start" }}>
        <Button
          w={{ base: "full", xs: "fit-content" }}
          mt={{
            base: 8,
            sm: 8,
          }}
          fontWeight={"extrabold"}
          fontSize={{
            base: "md",
            md: "lg",
          }}
          bg="brand.500"
          _dark={{
            bg: "brand.400",
            color: "gray.900",
          }}
          _hover={{
            bg: "brand.600",
          }}
          px={{
            base: 8,
            md: 10,
          }}
          py={{
            base: 3,
            md: 4,
          }}
          cursor="pointer"
          isDisabled={isLoading || !latest}
          isLoading={isLoading}
          onClick={handleDownLoadLatest}
        >
          Download
        </Button>
        <Text
          mt={"10px"}
          textDecor={"underline"}
          fontWeight={"bold"}
          fontStyle={"italic"}
        >
          Get the latest version
        </Text>
      </Flex>
      <Button
        as={Link}
        href={"https://docs.transcribely.io/gettingStarted"}
        target="_blank"
        cursor={"pointer"}
        variant={"outline"}
        w={{ base: "full", xs: "fit-content" }}
        mt={{
          base: 8,
          sm: 8,
        }}
        px={{
          base: 8,
          md: 10,
        }}
        py={{
          base: 3,
          md: 4,
        }}
        fontSize={{
          base: "md",
          md: "lg",
        }}
      >
        Get started
      </Button>
    </Flex>
  );
};

export default TranscribelyPurchasedHeroButtons;
