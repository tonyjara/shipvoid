import { MenuItem } from "@chakra-ui/react";
import type { User } from "@prisma/client";
import React from "react";
import { handleMutationAlerts } from "@/components/Alerts/MyToast";
import { trpcClient } from "@/utils/api";

const UsersRowOptions = ({
  user,
  setEditUser,
  onEditOpen,
  setMenuData,
}: {
  onEditOpen: () => void;
  setEditUser: React.Dispatch<React.SetStateAction<any | null>>;
  user: User;
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

  const { mutate } = trpcClient.accounts.toggleActivation.useMutation(
    handleMutationAlerts({
      successText: "User has been modified",
      callback: () => {
        context.users.invalidate();
        closeMenu();
      },
    }),
  );

  return (
    <>
      <MenuItem
        onClick={() => {
          mutate({ userId: user.id, active: !user.active });
        }}
      >
        {user.active ? "Deactivate user" : "Reactivate user"}
      </MenuItem>
      <MenuItem
        onClick={() => {
          setEditUser(user);
          onEditOpen();
          closeMenu();
        }}
      >
        Edit role
      </MenuItem>
    </>
  );
};

export default UsersRowOptions;
