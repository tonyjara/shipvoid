import DynamicTable, {
  RowOptionsType,
} from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { trpcClient } from "@/utils/api";
import PageContainer from "@/components/Containers/PageContainer";
import AsyncExportDataToExcel from "@/components/AsyncExportDataToCsv";
import MailingListRowOptions from "./MailingList.rowOptions";
import { mailingListColumns } from "./MailingList.colums";

const MailingListPage = () => {
  const dynamicTableProps = useDynamicTable();

  const { pageIndex, pageSize, sorting } = dynamicTableProps;

  const { data, isFetching, isLoading } =
    trpcClient.mailingList.getMany.useQuery({
      pageIndex,
      pageSize,
      sorting,
    });
  const { data: count } = trpcClient.mailingList.count.useQuery();

  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return <MailingListRowOptions row={x} setMenuData={setMenuData} />;
  };
  return (
    <PageContainer>
      <DynamicTable
        loading={isFetching || isLoading}
        headerRightComp={<AsyncExportDataToExcel />}
        rowOptions={rowOptionsFunction}
        title={"Mailing List"}
        data={data ?? []}
        count={count}
        columns={mailingListColumns({ pageIndex, pageSize })}
        {...dynamicTableProps}
      />
    </PageContainer>
  );
};
export default MailingListPage;
