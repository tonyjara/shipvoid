import { createColumnHelper } from "@tanstack/react-table";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import { Logs, PurchaseIntent } from "@prisma/client";
import BooleanCell from "@/components/DynamicTables/DynamicCells/Boolean.cell";
import MillisecondsCell from "@/components/DynamicTables/DynamicCells/MilliSecondsCell";

const columnHelper = createColumnHelper<PurchaseIntent>();

export const purchaseIntentsColumns = () => [
  columnHelper.accessor("createdAt", {
    cell: (x) => <MillisecondsCell date={x.getValue()} />,
    header: "Created At",
    sortingFn: "datetime",
  }),

  columnHelper.accessor("customerEmail", {
    cell: (x) => <TextCell text={x.getValue() ?? "-"} />,
    header: "Email",
    sortingFn: "text",
  }),
  columnHelper.accessor("succeeded", {
    cell: (x) => <BooleanCell isActive={x.getValue()} />,
    header: "Succeeded",
  }),
];
