import CreateStripeProductForm from "@/components/Forms/CreateStripeProduct.form";
import EditStripeProductForm from "@/components/Forms/EditStripeProduct.form";
import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import { trpcClient } from "@/utils/api";
import {
  Text,
  Flex,
  VStack,
  useDisclosure,
  Button,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import PageContainer from "@/components/Containers/PageContainer";

const StripeProducts = () => {
  const trpcContext = trpcClient.useUtils();
  const [missingProducts, setMissingProducts] = React.useState<string[]>([]);
  const [missingPrices, setMissingPrices] = React.useState<string[]>([]);
  const { data, isLoading } = trpcClient.stripe.getProductsAndPrices.useQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (
      data?.psPrices.length === data?.prices.data.length &&
      data?.psProducts.length === data?.products?.data.length
    )
      return;

    const findMissingProducts = data?.products.data.filter(
      (prod) => !data.psProducts.some((psProd) => psProd.id === prod.id),
    );
    setMissingProducts(findMissingProducts?.map((x) => x.id) ?? []);

    const findMissingPrices = data?.prices.data.filter(
      (price) => !data.psProducts.some((psPrice) => psPrice.id === price.id),
    );
    setMissingPrices(findMissingPrices?.map((x) => x.id) ?? []);
    return () => {};
  }, [data]);

  const { mutate: introspect } =
    trpcClient.stripe.pullStripePricesAndProducts.useMutation(
      handleUseMutationAlerts({
        successText: "Successfully pulled products and prices from Stripe",
        callback: () => {
          trpcContext.invalidate();
        },
      }),
    );

  return (
    <PageContainer>
      <Flex flexDir={"column"}>
        {isLoading && (
          <Flex gap={"20px"}>
            <Text fontSize={"xl"}>Loading stripe products and prices</Text>
            <Spinner />
          </Flex>
        )}
        {/*NOTE: This will appear when your products and prices are not in sync with Stripe */}
        {(missingProducts.length > 0 || missingPrices.length > 0) && (
          <Flex gap={"20px"} px={"20px"}>
            <Text fontSize={"xl"} pb={"20px"} fontWeight={"bold"}>
              {missingProducts.length &&
                `${missingProducts.length} Products missing`}{" "}
              from the database <br />
              {missingPrices.length &&
                `${missingPrices.length} Prices missing`}{" "}
              from the database
            </Text>
            <Button
              onClick={() =>
                introspect({
                  productIds: missingProducts,
                  priceIds: missingPrices,
                })
              }
            >
              Instrospect
            </Button>
          </Flex>
        )}
        <Flex py={"20px"} gap={"20px"} alignItems={"center"}>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {" "}
            {data?.products.data.length} Products and {data?.prices.data.length}{" "}
            Prices
          </Text>
          <Button size={"sm"} onClick={onOpen} leftIcon={<BiPlus />}>
            Create product
          </Button>
        </Flex>
        <VStack w="full">
          {data?.products.data
            .sort(
              (a: any, b: any) =>
                (a.metadata?.sortOrder ?? "0") - (b.metadata?.sortOrder ?? "0"),
            )
            .map((product) => {
              const productPrices = data.prices.data.filter(
                (x) => x.product === product.id,
              );

              return (
                <EditStripeProductForm
                  key={product.id}
                  product={product}
                  prices={productPrices}
                />
              );
            })}
        </VStack>
        <CreateStripeProductForm isOpen={isOpen} onClose={onClose} />
      </Flex>
    </PageContainer>
  );
};

export default StripeProducts;
