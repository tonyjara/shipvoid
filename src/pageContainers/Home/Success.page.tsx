interface props {
  customerName: string;
  purchaseIntentId: string;
}

import { Box, Heading, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import CopyTextButton from "@/components/Buttons/CopyTextButton";
import { siteData } from "@/lib/Constants/SiteData";

export default function SuccessPage({ customerName, purchaseIntentId }: props) {
  return (
    <Box w="100%" display={"flex"} justifyContent={"center"}>
      <Box maxW={"800px"} textAlign="center" py={10} px={6}>
        <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Thank you for your purchase {customerName}!
        </Heading>
        <Text color={"gray.500"}>
          You should receive an email with a link to signup and access your
          products. If you didn't receive an email, please contact us at{" "}
          {siteData.contactEmail} and include your purchase ID so we can help.
        </Text>
        <CopyTextButton
          className="mt-8"
          buttonText="Click to copy your Purchase ID"
          copyValue={purchaseIntentId}
        />
      </Box>
    </Box>
  );
}
