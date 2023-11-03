import { trpcClient } from "@/utils/api";
import { Button, Flex, Text, VStack, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import PricingCard from "../Cards/Pricing.card";
import { handleUseMutationAlerts } from "../Alerts/MyToast";
import Stripe from "stripe";
import FormControlledText from "./FormControlled/FormControlledText";
import { zodResolver } from "@hookform/resolvers/zod";
import CollapsableContainer from "../CollapsableContainer";
import FormControlledSwitch from "./FormControlled/FormControlledSwitch";
import { BiPlus } from "react-icons/bi";
import { PlanType } from "@prisma/client";
import FormControlledSelect from "./FormControlled/FormControlledSelect";
import EditStripePriceForm from "./EditStripePrice.form";
import CreateStripePriceForm from "./CreateStripePrice.form";
import {
  PSStripeProductUpdate,
  validatePSStripeProductUpdate,
} from "@/lib/Validations/StripeProductUpdate.validate";

const EditStripeProductForm = ({
  prices,
  product,
}: {
  product: Stripe.Product;
  prices: Stripe.Price[];
}) => {
  const trpcContext = trpcClient.useUtils();
  const { onOpen, isOpen, onClose } = useDisclosure();

  const defaultValues: PSStripeProductUpdate = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product?.description ?? "",
    features: product.metadata.features ?? "",
    payAsYouGo: product.metadata.payAsYouGo ?? "",
    sortOrder: product.metadata.sortOrder ?? "",
    planType: (product.metadata.planType as PlanType) ?? "",
  };

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PSStripeProductUpdate>({
    defaultValues,
    resolver: zodResolver(validatePSStripeProductUpdate),
  });
  const { mutate: update, isLoading: isUpdating } =
    trpcClient.stripe.editProduct.useMutation(
      handleUseMutationAlerts({
        successText: "Product updated successfully",
        callback: () => {
          trpcContext.invalidate();
        },
      }),
    );
  const submitFunc = async (data: PSStripeProductUpdate) => {
    update(data);
  };

  const features = product.metadata?.features;
  const payAsYouGo = product.metadata?.payAsYouGo;
  return (
    <Flex
      py={"20px"}
      gap={"20px"}
      flexDir={{ base: "column", md: "row" }}
      w="full"
      justifyContent={{ base: "center", md: "space-around" }}
      alignContent={"center"}
      alignItems={{ base: "center", md: "flex-start" }}
      key={product.id}
    >
      <Flex w="full" flexDir={"column"} maxW={"400px"}>
        <form
          style={{ width: "100%" }}
          onSubmit={handleSubmit(submitFunc)}
          noValidate
        >
          <CollapsableContainer
            startCollapsed
            title={`Product N. ${product.metadata?.sortOrder ?? "-"}`}
          >
            <Flex
              w="100%"
              pointerEvents={isUpdating ? "none" : undefined}
              justifyContent={"end"}
              gap={"20px"}
            >
              <Button
                isDisabled={isSubmitting}
                aria-label="save changes"
                type="submit"
                size="sm"
              >
                Save changes{" "}
              </Button>
            </Flex>
            <Flex dir="column" gap={"10px"} py="10px">
              <Text>Id: {product.id}</Text>
              {/* <Text whiteSpace="break-spaces"> */}
              {/*   Default price Id: {product?.default_price?.toString() ?? ""} */}
              {/* </Text> */}
            </Flex>
            <FormControlledSwitch
              control={control}
              errors={errors}
              name="active"
              label="Active"
            />

            <FormControlledText
              control={control}
              errors={errors}
              name="name"
              label="Name"
            />
            <FormControlledText
              control={control}
              errors={errors}
              isTextArea
              name="description"
              label="Description"
            />

            <FormControlledText
              control={control}
              errors={errors}
              name="features"
              label="Features"
              isTextArea
            />
            <FormControlledText
              control={control}
              errors={errors}
              name="payAsYouGo"
              label="Pay as you go"
              helperText="Used to supplement prices non default prices"
              isTextArea
            />

            <FormControlledSelect
              control={control}
              errors={errors}
              name="planType"
              label="Plan Type"
              options={Object.values(PlanType).map((value) => ({
                value,
                label: value,
              }))}
            />
            <FormControlledText
              control={control}
              errors={errors}
              name="sortOrder"
              label="Sort order"
            />
          </CollapsableContainer>
        </form>
        <CollapsableContainer
          titleComponents={
            <Button size={"sm"} onClick={onOpen} leftIcon={<BiPlus />}>
              Add
            </Button>
          }
          startCollapsed
          title="Prices"
          style={{ marginTop: "20px" }}
        >
          <Flex py={"10px"} flexDir="column" gap={"10px"}>
            {prices
              .sort(
                (a, b) =>
                  parseInt(a.metadata?.sortOrder ?? "0") -
                  parseInt(b.metadata?.sortOrder ?? "0"),
              )
              .map((price) => {
                return (
                  <EditStripePriceForm
                    key={price.id}
                    price={price}
                    isDefault={price.id === product.default_price}
                  />
                );
              })}
          </Flex>
        </CollapsableContainer>
      </Flex>
      <PricingCard
        /* popular={i === 1} */
        autenticated={true}
        payAsYouGo={payAsYouGo ? payAsYouGo.split(",") : []}
        handleCheckout={() => {
          if (!product.default_price || !product.id) return;
          /* return handleCheckout(product.id, product.default_price); */
        }}
        description={product.description ?? ""}
        /* autenticated={authenticated} */
        defaultPriceId={product.default_price?.toString() ?? ""}
        title={product.name}
        features={features ? features.split(",") : []}
        prices={prices}
      />
      <CreateStripePriceForm
        product={product}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Flex>
  );
};

export default EditStripeProductForm;
