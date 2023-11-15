import { appOptions } from "@/lib/Constants/AppOptions";
import { Text, Flex, chakra, Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const TranscribelyHeroOptions = ({
  handleCheckout,
  checkoutDisabled,
}: {
  handleCheckout: () => void;
  checkoutDisabled: boolean;
}) => {
  return (
    <div style={{ zIndex: 1 }}>
      {appOptions.heroScreenType === "ready" && (
        <Flex flexDir={"column"} alignItems={{ base: "center", lg: "start" }}>
          <Button
            w={{ base: "full", xs: "fit-content" }}
            mt={{
              base: 8,
              sm: 8,
            }}
            display="flex"
            fontWeight={"extrabold"}
            border="solid 1px transparent"
            fontSize={{
              base: "md",
              md: "lg",
            }}
            color="#0f0e0d"
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
            onClick={handleCheckout}
            isDisabled={checkoutDisabled}
          >
            Buy Now
          </Button>
          <Text
            mt={"10px"}
            textDecor={"underline"}
            fontWeight={"bold"}
            fontStyle={"italic"}
          >
            Get unlimited updates
          </Text>
        </Flex>
      )}

      {appOptions.heroScreenType === "comingSoon" && (
        <Flex flexDir={"column"} alignItems={{ base: "center", xl: "start" }}>
          <Flex pt={"30px"} flexDir={"column"} alignItems={"center"}>
            <Text
              fontWeight={"bold"}
              letterSpacing={"wide"}
              fontStyle={"italic"}
              fontSize={"6xl"}
            >
              Coming soon
            </Text>
          </Flex>
        </Flex>
      )}
      {appOptions.heroScreenType === "maintenance" && (
        <Flex flexDir={"column"} alignItems={{ base: "center", xl: "start" }}>
          <Flex pt={"30px"} flexDir={"column"} alignItems={"center"}>
            <Text
              fontWeight={"bold"}
              letterSpacing={"wide"}
              fontStyle={"italic"}
              fontSize={"4xl"}
            >
              We're under maintenance, we'll be back soon!
            </Text>
          </Flex>
        </Flex>
      )}
      {appOptions.heroScreenType === "notifyMeWhenReady" && (
        <Flex
          mt={8}
          flexDir={"column"}
          alignItems={{ base: "center", xl: "start" }}
        >
          <Flex flexDir={"column"} alignItems={"center"}>
            <Text mb={"10px"} fontSize={"4xl"} fontStyle={"italic"}>
              We're almost ready!
            </Text>
            <chakra.a
              as={Link}
              href={"/newsletter"}
              fontWeight={"extrabold"}
              border="solid 1px transparent"
              fontSize={{
                base: "md",
                md: "lg",
              }}
              rounded="md"
              color="#0f0e0d"
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
            >
              Join the waitlist
            </chakra.a>
            <Text
              mt={"10px"}
              textDecor={"underline"}
              fontWeight={"bold"}
              fontStyle={"italic"}
            >
              Get notified when we launch
            </Text>
          </Flex>
        </Flex>
      )}
    </div>
  );
};

export default TranscribelyHeroOptions;
