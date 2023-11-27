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

  const { mutate: manualVerify } =
    trpcClient.admin.confirmPurchaseManually.useMutation(
      handleMutationAlerts({
        successText: "Purchase confirmed successfully",
        callback: () => {
          context.invalidate();
          closeMenu();
        },
      }),
    );
  const { mutate: sendVerificationLink } =
    trpcClient.admin.sendNewVerificationLink.useMutation(
      handleMutationAlerts({
        successText: "Verification link sent successfully",
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
          manualVerify({
            id: purchaseIntent.id,
            customerEmail: purchaseIntent.customerEmail,
            customerName: purchaseIntent.customerName,
          });
          closeMenu();
        }}
      >
        Confirm Purchase
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (!purchaseIntent.customerEmail || !purchaseIntent.customerName)
            return;
          sendVerificationLink({
            id: purchaseIntent.id,
            customerEmail: purchaseIntent.customerEmail,
            customerName: purchaseIntent.customerName,
          });
          closeMenu();
        }}
      >
        Send purchase verification email
      </MenuItem>
    </>
  );
};

export default PurchaseIntentsRowOptions;
