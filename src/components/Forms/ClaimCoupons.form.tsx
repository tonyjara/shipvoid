import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import { trpcClient } from "@/utils/api";
import { Button, Flex } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import FormControlledText from "./FormControlled/FormControlledText";
import { z } from "zod";

const validateCouponCode = z.object({
  couponCode: z.string().min(1, "Field is required"),
});

const ClaimCouponsForm = () => {
  const trpcContext = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ couponCode: string }>({
    defaultValues: { couponCode: "" },
    resolver: zodResolver(validateCouponCode),
  });
  const { data: couponsCount } = trpcClient.coupons.countCoupons.useQuery();
  const { mutate, isLoading } = trpcClient.coupons.claimCoupon.useMutation(
    handleUseMutationAlerts({
      successText: "Coupon claimed",
      callback: () => {
        trpcContext.invalidate();
        reset();
      },
    }),
  );
  const submitFunc = async (data: { couponCode: string }) => {
    mutate(data);
  };

  return (
    <form
      style={{
        marginTop: "20px",
        display: couponsCount && couponsCount > 0 ? "block" : "none",
      }}
      onSubmit={handleSubmit(submitFunc)}
      noValidate
    >
      <Flex gap={5} alignItems={"center"}>
        <FormControlledText
          control={control}
          errors={errors}
          name="couponCode"
          label="Coupon Code"
          maxW="150px"
        />

        <Button
          type="submit"
          mt={"20px"}
          isDisabled={isLoading || isSubmitting}
          isLoading={isSubmitting}
          colorScheme="green"
        >
          Claim Coupon
        </Button>
      </Flex>
    </form>
  );
};

export default ClaimCouponsForm;
