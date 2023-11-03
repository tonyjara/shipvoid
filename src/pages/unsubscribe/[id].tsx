import React from "react";
interface props {
  email: string;
}

import { Box, Heading } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { GetServerSideProps } from "next";
import { siteData } from "@/lib/Constants";
import { prisma } from "@/server/db";

//This page will be shown when a user clicks on the unsubscribe link in their email
//Even if they already unsubscribed, this page will still be shown
export default function Unsubscribe({ email }: props) {
  return (
    <Box w="100%" display={"flex"} justifyContent={"center"}>
      <Box maxW={"800px"} textAlign="center" py={10} px={6}>
        <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
          {email} has been unsubscribed from {siteData.appName}&apos;s mailing
          list
        </Heading>
      </Box>
    </Box>
  );
}

function returnHome() {
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
    props: {},
  };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const unsubscribeId = context.query.id as string | undefined;
    if (!unsubscribeId) return returnHome();

    const mailingListRow = await prisma.mailingList.findFirst({
      where: { unsubscribeId },
    });

    if (!mailingListRow) return returnHome();
    await prisma.mailingList.update({
      where: { id: mailingListRow.id },
      data: { hasUnsubscribed: true },
    });

    return {
      props: { email: mailingListRow.email },
    };
  } catch (error) {
    console.error(error);
  }

  return {
    props: {},
  };
};
