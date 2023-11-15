import { decimalDivBy100 } from "@/lib/utils/DecimalUtils";
import {
  Text,
  Box,
  Button,
  List,
  ListIcon,
  ListItem,
  useColorModeValue,
  Divider,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import Stripe from "stripe";

//Features and payAsYouGo are stored in stripe metadata

export interface PricingCardProps {
  title: string;
  defaultPriceId: string;
  prices: Stripe.Price[];
  features: string[];
  description: string;
  //Add a banner to the top of the card
  popular?: boolean;
  handleCheckout: () => void;
  //Change the button text if the user is logged in
  autenticated: boolean;
  subscriptionId?: string;
  alreadyBought?: boolean;
}

const PricingCard = ({
  description,
  popular,
  title,
  defaultPriceId,
  handleCheckout,
  prices,
  features,
  alreadyBought,
}: PricingCardProps) => {
  const defaultPrice = prices.find((x) => x.id === defaultPriceId);

  return (
    <Box
      shadow="base"
      borderWidth="1px"
      borderColor={useColorModeValue("gray.200", "gray.500")}
      borderRadius={"xl"}
      w="100%"
      maxW={"400px"}
      height={"100%"}
      alignSelf={{ base: "center", md: "flex-start" }}
      pt={2}
    >
      <Box position={"relative"}>
        {popular && (
          <Box
            position="absolute"
            top="-16px"
            left="50%"
            style={{ transform: "translate(-50%)" }}
          >
            <Text
              textTransform="uppercase"
              bg="brand.300"
              px={3}
              py={1}
              fontSize="sm"
              fontWeight="600"
              rounded="xl"
              whiteSpace="nowrap"
            >
              Most Popular
            </Text>
          </Box>
        )}

        <Flex px={4} flexDir={"column"} gap={"10px"}>
          <Text fontWeight="bold" fontSize="3xl">
            {title}
          </Text>
          <Text color={"gray.500"} fontWeight={"medium"} fontSize={"sm"}>
            {description}
          </Text>
          <Flex mb={"-10px"} pt={4}>
            <Text fontSize="5xl" fontWeight="900">
              ${decimalDivBy100(defaultPrice?.unit_amount_decimal)}
            </Text>
          </Flex>
          <Divider pb="10px" />
        </Flex>
        <Flex flexDir={"column"} p={4}>
          {/* Features */}
          <List spacing={3}>
            {features.map((x) => (
              <ListItem key={x}>
                <ListIcon as={FaCheckCircle} color="brand.500" />
                {x}
              </ListItem>
            ))}
          </List>
          <Box w="100%" pt={8} pb={2}>
            {!alreadyBought && (
              <Button onClick={handleCheckout} w="full" variant="solid">
                Buy Now
              </Button>
            )}

            {alreadyBought && (
              <Button
                w="full"
                colorScheme="gray"
                variant="solid"
                pointerEvents={"none"}
              >
                Bought
              </Button>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default PricingCard;
