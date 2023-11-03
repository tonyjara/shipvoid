import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import type { RowOptionsType } from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { trpcClient } from "@/utils/api";
import { User } from "@prisma/client";
import UsersRowOptions from "./Users.rowOptions";
import { usersColumns } from "./Users.columns";
import EditUserModal from "@/components/Modals/EditUser.modal";
import PageContainer from "@/components/Containers/PageContainer";

const UsersPage = () => {
  const [editUser, setEditUser] = useState<User | null>(null);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, pageSize, sorting } = dynamicTableProps;

  const { data, isFetching, isLoading } = trpcClient.users.getMany.useQuery({
    pageIndex,
    pageSize,
    sorting,
  });
  const { data: count } = trpcClient.users.count.useQuery();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editUser) {
      setEditUser(null);
    }
    return () => {};
  }, [editUser, isEditOpen]);

  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return (
      <UsersRowOptions
        user={x}
        onEditOpen={onEditOpen}
        setEditUser={setEditUser}
        setMenuData={setMenuData}
      />
    );
  };

  return (
    <PageContainer>
      <DynamicTable
        title={"Users"}
        columns={usersColumns({
          pageIndex,
          pageSize,
        })}
        loading={isFetching || isLoading}
        data={data ?? []}
        count={count ?? 0}
        rowOptions={rowOptionsFunction}
        {...dynamicTableProps}
      />
      {editUser && (
        <EditUserModal
          user={editUser}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </PageContainer>
  );
};

export default UsersPage;
