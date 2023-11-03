import { createColumnHelper } from "@tanstack/react-table";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import { Logs } from "@prisma/client";
import MillisecondsCell from "../../components/DynamicTables/DynamicCells/MilliSecondsCell";

const columnHelper = createColumnHelper<Logs>();

const handleLevelColor = (level: string) => {
  switch (level) {
    case "INFO":
      return "green.300";
    case "WARN":
      return "yellow.300";
    case "ERROR":
      return "red.300";
    default:
      return "gray";
  }
};

export const adminLogsColumns = () => [
  columnHelper.accessor("createdAt", {
    cell: (x) => <MillisecondsCell date={x.getValue()} />,
    header: "Created At",
    sortingFn: "datetime",
  }),

  columnHelper.accessor("level", {
    cell: (x) => (
      <TextCell
        color={handleLevelColor(x.getValue())}
        text={x.getValue() ?? "-"}
      />
    ),
    header: "level",
    sortingFn: "text",
  }),
  columnHelper.accessor("message", {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: "Message",
    sortingFn: "text",
  }),

  columnHelper.accessor("eventId", {
    cell: (x) => <TextCell text={x.getValue() ?? "-"} />,
    header: "Event Id",
    sortingFn: "text",
  }),
];
