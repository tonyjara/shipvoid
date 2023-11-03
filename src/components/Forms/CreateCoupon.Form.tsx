import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import { trpcClient } from "@/utils/api";
import { Button, Flex } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Coupons } from "@prisma/client";
import FormControlledNumberInput from "./FormControlled/FormControlledNumberInput";
import {
  defaultCouponsValues,
  validateCoupons,
} from "@/lib/Validations/CouponCreate.validate";

const CreateCouponForm = () => {
  const trpcContext = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Coupons>({
    defaultValues: defaultCouponsValues,
    resolver: zodResolver(validateCoupons),
  });
  const { mutate } = trpcClient.admin.createCoupon.useMutation(
    handleUseMutationAlerts({
      successText: "Coupon created",
      callback: () => {
        trpcContext.invalidate();
        reset(defaultCouponsValues);
      },
    }),
  );
  const submitFunc = async (data: Coupons) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(submitFunc)} noValidate>
      <Flex gap={5} alignItems={"center"}>
        <FormControlledNumberInput
          control={control}
          errors={errors}
          name="chatInputCredits"
          label="Chat Input Credits"
          maxW="150px"
        />

        <FormControlledNumberInput
          control={control}
          errors={errors}
          name="chatOutputCredits"
          label="Chat O. Credits"
          maxW="150px"
        />

        <FormControlledNumberInput
          control={control}
          errors={errors}
          name="transcriptionMinutes"
          label="T. Minutes"
          maxW="150px"
        />

        <Button
          type="submit"
          mt={"20px"}
          isLoading={isSubmitting}
          colorScheme="green"
        >
          Create Coupon
        </Button>
      </Flex>
    </form>
  );
};

export default CreateCouponForm;
