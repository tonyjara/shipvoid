import React, { useEffect } from "react";
interface props {
  customerName: string;
}

import { Box, Heading, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

export default function SuccessPage({ customerName }: props) {
  const router = useRouter();
  const [redirectSeconds, setRedirectSeconds] = React.useState(5);

  useEffect(() => {
    if (redirectSeconds == 0) {
      router.push("/home");
      return;
    }

    setTimeout(() => {
      setRedirectSeconds((redirectSeconds) => redirectSeconds - 1);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectSeconds]);

  return (
    <Box w="100%" display={"flex"} justifyContent={"center"}>
      <Box maxW={"800px"} textAlign="center" py={10} px={6}>
        <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Thanks for registering {customerName}!
        </Heading>
        <Text color={"gray.500"}>
          We appreciate you registering, you can check your usage and billing
          from the settings page. You'll be redirected to the home page briefly.
        </Text>
      </Box>
    </Box>
  );
}
