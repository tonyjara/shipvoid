import { trpcClient } from "@/utils/api";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Button,
  Flex,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { handleMutationAlerts } from "../Alerts/MyToast";
import FormControlledText from "./FormControlled/FormControlledText";
import Stripe from "stripe";
import FormControlledSelect from "./FormControlled/FormControlledSelect";
import {
  PSStripePriceCreate,
  DefaultPSStripePriceCreate,
  validateStripePriceCreate,
} from "@/lib/Validations/StripePriceCreate.validate";

const CreateStripePriceForm = ({
  isOpen,
  onClose,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Stripe.Product;
}) => {
  const trpcContext = trpcClient.useUtils();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PSStripePriceCreate>({
    defaultValues: { ...DefaultPSStripePriceCreate, productId: product.id },
    resolver: zodResolver(validateStripePriceCreate),
  });
  const { mutate, isLoading } = trpcClient.stripe.createPrice.useMutation(
    handleMutationAlerts({
      successText: "Price created",
      callback: () => {
        trpcContext.invalidate();
        reset();
        onClose();
      },
    }),
  );
  const submitFunc = async (data: PSStripePriceCreate) => {
    mutate(data);
  };

  return (
    <Modal
      blockScrollOnMount={false}
      onClose={onClose}
      size={"3xl"}
      isOpen={isOpen}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Stripe Price</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(submitFunc)} noValidate>
            <Flex flexDir={"column"} gap={5}>
              <FormControlledText
                control={control}
                errors={errors}
                name="nickName"
                label="Nick Name"
              />
              <FormControlledText
                control={control}
                errors={errors}
                name="unit_amount_decimal"
                label="Unit Amount Decimal"
                helperText="Add price normally, we will multiply by 100 for you in the backend."
              />

              <FormControlledText
                control={control}
                errors={errors}
                name="sortOrder"
                label="Sort Order"
              />

              <Button
                type="submit"
                isLoading={isLoading || isSubmitting}
                size="lg"
                alignSelf={"flex-end"}
              >
                Create
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateStripePriceForm;
