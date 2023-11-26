import { MenuItem } from "@chakra-ui/react";
import type { PurchaseIntent, User } from "@prisma/client";
import React from "react";
import { handleMutationAlerts } from "@/components/Alerts/MyToast";
import { trpcClient } from "@/utils/api";

const PurchaseIntentsRowOptions = ({
  setMenuData,
  purchaseIntent,
}: {
  setMenuData: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      rowData: any | null;
    }>
  >;
  purchaseIntent: PurchaseIntent;
}) => {
  const context = trpcClient.useUtils();
  const closeMenu = () => {
    setMenuData((prev) => ({ ...prev, rowData: null }));
  };

  const { mutate } = trpcClient.admin.confirmPurchaseManually.useMutation(
    handleMutationAlerts({
      successText: "Purchase confirmed successfully",
      callback: () => {
        context.invalidate();
        closeMenu();
      },
    }),
  );

  return (
    <>
      <MenuItem
        onClick={() => {
          if (!purchaseIntent.customerEmail || !purchaseIntent.customerName)
            return;
          mutate({
            id: purchaseIntent.id,
            customerEmail: purchaseIntent.customerEmail,
            customerName: purchaseIntent.customerName,
          });
          closeMenu();
        }}
      >
        Confirm Purchase
      </MenuItem>
    </>
  );
};

export default PurchaseIntentsRowOptions;
