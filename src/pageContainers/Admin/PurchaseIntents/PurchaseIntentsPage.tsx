import PageContainer from "@/components/Containers/PageContainer";
import DynamicTable, {
  RowOptionsType,
} from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { trpcClient } from "@/utils/api";
import React from "react";
import { purchaseIntentsColumns } from "./PurchseInetnts.columns";
import PurchaseIntentsRowOptions from "./PurchaseIntent.rowOptions";

const PurchaseIntentsPage = () => {
  const pagination = useDynamicTable();
  const { data: purchaseIntents, isLoading } =
    trpcClient.admin.getManyPurchaseIntents.useQuery();

  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return (
      <PurchaseIntentsRowOptions purchaseIntent={x} setMenuData={setMenuData} />
    );
  };
  return (
    <PageContainer>
      <DynamicTable
        title="Purchase Intents"
        {...pagination}
        data={purchaseIntents}
        loading={isLoading}
        rowOptions={rowOptionsFunction}
        columns={purchaseIntentsColumns()}
      />
    </PageContainer>
  );
};

export default PurchaseIntentsPage;
