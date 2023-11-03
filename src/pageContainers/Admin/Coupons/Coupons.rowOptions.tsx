import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import { Coupons } from "@prisma/client";
import { trpcClient } from "@/utils/api";

export const CouponsRowOptions = ({
  x,
  setMenuData,
}: {
  x: Coupons;
  setMenuData: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      rowData: any | null;
    }>
  >;
}) => {
  const context = trpcClient.useContext();
  const closeMenu = () => {
    setMenuData((prev) => ({ ...prev, rowData: null }));
  };
  const { mutate: deleteCoupon, isLoading } =
    trpcClient.admin.deleteCoupon.useMutation(
      handleUseMutationAlerts({
        successText: "Coupon deleted",
        callback: () => {
          context.invalidate();
          closeMenu();
        },
      }),
    );

  const handleDelete = () => {
    deleteCoupon({ id: x.id });
    closeMenu();
  };

  return (
    <>
      <MenuItem isDisabled={isLoading} onClick={() => handleDelete()}>
        Delete
      </MenuItem>
    </>
  );
};
