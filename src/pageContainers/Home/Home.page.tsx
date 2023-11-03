import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { trpcClient } from "@/utils/api";
import { Button, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { scribesPageColumns } from "@/pageContainers/Scribes/ScribesPage.columns";
import CreateScribeModal from "@/components/Modals/CreateScribe.modal";
import PageContainer from "@/components/Containers/PageContainer";
import WelcomeModal from "@/components/Modals/Welcome.modal";

export default function HomePage() {
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, pageSize, sorting } = dynamicTableProps;

  //To enable filters under header
  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.ScribeScalarWhereInput[]
  >([]);
  const router = useRouter();

  const {
    isOpen: isNewScribeOpen,
    onOpen: onNewScribeOpen,
    onClose: onNewScribeClose,
  } = useDisclosure();

  const { data: scribes, isLoading: scribesAreLoading } =
    trpcClient.scribe.getMany.useQuery({
      pageSize,
      pageIndex,
      sorting,
      whereFilterList,
    });
  const { data: count } = trpcClient.scribe.count.useQuery();

  const handleRowClick = (row: any) => {
    return router.push(`home/scribes/${row.id}`);
  };
  const handleSubtitleText = () => {
    if (!scribes?.length && !scribesAreLoading) {
      return "You have no scribes! Click the shiny button!";
    }
    return undefined;
  };

  //
  return (
    <PageContainer>
      <DynamicTable
        loading={scribesAreLoading}
        rowActions={handleRowClick}
        enableColumnFilters={true}
        whereFilterList={whereFilterList}
        setWhereFilterList={setWhereFilterList}
        title={"Scribes list"}
        data={scribes ?? []}
        columns={scribesPageColumns()}
        count={count ?? 0}
        subTitle={handleSubtitleText()}
        headerRightComp={
          <Button
            marginRight={"10px"}
            onClick={onNewScribeOpen}
            className={
              scribes?.length || scribesAreLoading || whereFilterList.length
                ? undefined
                : "glow"
            }
            size="sm"
          >
            Add Scribe
          </Button>
        }
        {...dynamicTableProps}
      />
      <CreateScribeModal isOpen={isNewScribeOpen} onClose={onNewScribeClose} />
      <WelcomeModal />
    </PageContainer>
  );
}
