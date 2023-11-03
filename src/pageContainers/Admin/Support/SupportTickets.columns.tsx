import { createColumnHelper } from "@tanstack/react-table";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import { SupportTicket, SupportTicketPriority } from "@prisma/client";
import DateCell from "@/components/DynamicTables/DynamicCells/Date.cell";
import ImageModalCell from "@/components/DynamicTables/DynamicCells/ImageModal.cell";

const columnHelper = createColumnHelper<SupportTicket>();

const handlePriorityColor = (x: SupportTicketPriority) => {
  switch (x) {
    case "low":
      return "green.300";
    case "medium":
      return "yellow.300";
    case "high":
      return "red.300";
    default:
      return "gray";
  }
};

export const supportTicketsColumn = () => [
  columnHelper.accessor("createdAt", {
    cell: (x) => <DateCell date={x.getValue()} />,
    header: "Created At",
    sortingFn: "datetime",
  }),

  columnHelper.accessor("subject", {
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.accessor("message", {
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.accessor("priority", {
    cell: (x) => (
      <TextCell
        color={handlePriorityColor(x.getValue())}
        text={x.getValue() ?? "-"}
      />
    ),
  }),
  columnHelper.display({
    cell: (x) =>
      x.row.original.imageUrl && x.row.original.imageName ? (
        <ImageModalCell
          imageName={x.row.original.imageName}
          url={x.row.original.imageUrl}
        />
      ) : (
        "-"
      ),
    header: "Screenshot",
  }),
];
