import { MenuItem } from "@chakra-ui/react";
import type { MailingList, User } from "@prisma/client";
import React from "react";
import { handleMutationAlerts } from "@/components/Alerts/MyToast";
import { trpcClient } from "@/utils/api";

const MailingListRowOptions = ({
  row,
  setMenuData,
}: {
  row: MailingList;
  setMenuData: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      rowData: any | null;
    }>
  >;
}) => {
  const context = trpcClient.useUtils();
  const closeMenu = () => {
    setMenuData((prev) => ({ ...prev, rowData: null }));
  };

  const { mutate: deleteRow } = trpcClient.mailingList.deleteById.useMutation(
    handleMutationAlerts({
      successText: "Row has been deleted",
      callback: () => {
        context.mailingList.invalidate();
        closeMenu();
      },
    }),
  );

  return (
    <>
      <MenuItem
        onClick={() => {
          deleteRow({ id: row.id });
        }}
      >
        Delete
      </MenuItem>
    </>
  );
};

export default MailingListRowOptions;
