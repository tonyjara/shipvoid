import PageContainer from "@/components/Containers/PageContainer";
import EditStripePriceForm from "@/components/Forms/EditStripePrice.form";
import { trpcClient } from "@/utils/api";
import { Text, Flex } from "@chakra-ui/react";
import React from "react";

const StripePrices = () => {
  const { data } = trpcClient.stripe.getProductsAndPrices.useQuery();

  return (
    <PageContainer>
      <Flex gap={"20px"} flexDir={"column"} alignItems={"center"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          {" "}
          List of all stripe prices. Total: {data?.prices.data.length} Prices
        </Text>
        <Flex flexDir={"column"} maxW={"400px"} w="full">
          {data?.prices.data.map((price) => {
            return (
              <EditStripePriceForm
                key={price.id}
                price={price}
                isDefault={data?.products.data.some(
                  (product) => product.default_price === price.id,
                )}
              />
            );
          })}
        </Flex>
      </Flex>
    </PageContainer>
  );
};

export default StripePrices;
