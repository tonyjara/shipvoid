import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { trpcClient } from "@/utils/api";
import { adminLogsColumns } from "@/pageContainers/Admin/AdminLogs.columns";
import { Button } from "@chakra-ui/react";
import { handleMutationAlerts } from "@/components/Alerts/MyToast";
import PageContainer from "@/components/Containers/PageContainer";

const AdminPage = () => {
  const dynamicTableProps = useDynamicTable();
  const trpcContext = trpcClient.useUtils();

  const { data: logs } = trpcClient.logs.getLogs.useQuery();
  const { mutate: clear } = trpcClient.logs.clearAllLogs.useMutation(
    handleMutationAlerts({
      successText: "Logs cleared",
      callback: () => {
        trpcContext.invalidate();
      },
    }),
  );

  return (
    <PageContainer>
      <DynamicTable
        headerRightComp={<Button onClick={() => clear()}>Clear all</Button>}
        title={"Admin logs"}
        data={logs ?? []}
        columns={adminLogsColumns()}
        {...dynamicTableProps}
      />
    </PageContainer>
  );
};
export default AdminPage;
