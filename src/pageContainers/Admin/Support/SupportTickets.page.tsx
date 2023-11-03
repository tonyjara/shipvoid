import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { trpcClient } from "@/utils/api";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { supportTicketsColumn } from "./SupportTickets.columns";
import PageContainer from "@/components/Containers/PageContainer";

const SupportTicketsPage = () => {
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, pageSize, sorting } = dynamicTableProps;
  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.SupportTicketScalarWhereInput[]
  >([]);

  const { data: tickets } = trpcClient.support.getSupportTickets.useQuery({
    pageSize,
    pageIndex,
    sorting,
    whereFilterList,
  });
  const { data: countTickets } =
    trpcClient.support.countSupportTickets.useQuery({ whereFilterList });

  return (
    <PageContainer>
      <DynamicTable
        whereFilterList={whereFilterList}
        setWhereFilterList={setWhereFilterList}
        title={"Support Tickets"}
        data={tickets ?? []}
        count={countTickets ?? 0}
        columns={supportTicketsColumn()}
        {...dynamicTableProps}
      />
    </PageContainer>
  );
};
export default SupportTicketsPage;
