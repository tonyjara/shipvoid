import { trpcClient } from "@/utils/api";
import { Box, Text, Flex, useColorModeValue, Button } from "@chakra-ui/react";
import { format, isBefore } from "date-fns";
import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";

if (!process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL)
  throw new Error("NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL is not defined");

const BottomSubscriptionEndBanner = () => {
  const user = useSession().data?.user;
  const [showBanner, setShowBanner] = React.useState(true);
  const { data: mySubscription } = trpcClient.users.getMySubscription.useQuery(
    undefined,
    {
      enabled: !!user,
    },
  );

  const portalUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL;
  const newSubscriprionRoute = "/home/plans";

  const shouldShowBanner =
    showBanner &&
    !!user &&
    mySubscription?.cancellAt &&
    isBefore(new Date(), mySubscription.cancellAt);

  return (
    <Box
      display={shouldShowBanner ? "block" : "none"}
      position={"fixed"}
      backgroundColor={useColorModeValue("gray.100", "gray.700")}
      bottom={0}
      width={"100%"}
      p="0px"
      m="0px"
      height={"60px"}
    >
      {shouldShowBanner && (
        <Flex
          pt={"10px"}
          gap={"10px"}
          alignItems={"center"}
          justifyContent={"center"}
          alignContent={"center"}
        >
          {" "}
          <Text hideBelow={"md"} fontWeight={"bold"}>
            Your {mySubscription.isFreeTrial ? "trial" : "subscription"} ends{" "}
            {format(mySubscription?.cancellAt ?? new Date(), "MM/dd/yy")}
          </Text>
          <Text hideFrom={"md"} fontWeight={"bold"}>
            {mySubscription.isFreeTrial
              ? `Trial ends: ${format(
                  mySubscription?.cancellAt ?? new Date(),
                  "MM/dd/yy",
                )}`
              : "Plan about to expire"}
          </Text>
          <Button
            as={Link}
            href={mySubscription.isFreeTrial ? newSubscriprionRoute : portalUrl}
            target={mySubscription.isFreeTrial ? undefined : "_blank"}
            size={"sm"}
          >
            {mySubscription.isFreeTrial ? "Subscribe" : "Renew"}
          </Button>
          <Button
            bg="gray.400"
            onClick={() => setShowBanner(false)}
            size={"sm"}
          >
            Dismiss
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default BottomSubscriptionEndBanner;
