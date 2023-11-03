import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/db";
import { WarningIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Subscription } from "@prisma/client";
import { GetServerSideProps } from "next";
import { format, addMonths } from "date-fns";
import React from "react";
import Link from "next/link";
import { env } from "@/env.mjs";

interface props {
  subscription: Subscription;
}

const ReSubscribe = ({ subscription }: props) => {
  const portalUrl = env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL;

  return (
    <Box w="100%" display={"flex"} justifyContent={"center"}>
      <Box maxW={"800px"} textAlign="center" py={10} px={6}>
        <WarningIcon boxSize={"50px"} color={"yellow.500"} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Your subscription has been cancelled
        </Heading>
        <Text color={"gray.500"}>
          Your subscription has been cancelled since{" "}
          {format(subscription.cancellAt ?? new Date(), "MM/dd/yy")} we're going
          to keep your account as is until{" "}
          {format(
            addMonths(subscription.cancellAt ?? new Date(), 3),
            "MM/dd/yy",
          )}{" "}
          . If you'd like to re-subscribe, you can do so below.
        </Text>
        <Button
          as={Link}
          href={portalUrl}
          target="_blank"
          colorScheme="green"
          mt={"20px"}
        >
          Re-subscribe
        </Button>
      </Box>
    </Box>
  );
};

export default ReSubscribe;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session?.user.id },
  });

  if (!subscription || subscription.active) {
    return {
      notFound: true,
    };
  }

  return {
    props: { subscription },
  };
};
