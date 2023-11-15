import { createColumnHelper } from "@tanstack/react-table";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import { MailingList } from "@prisma/client";
import BooleanCell from "@/components/DynamicTables/DynamicCells/Boolean.cell";
import DateCell from "@/components/DynamicTables/DynamicCells/Date.cell";

const columnHelper = createColumnHelper<MailingList>();

export const mailingListColumns = ({
  pageIndex,
  pageSize,
}: {
  pageSize: number;
  pageIndex: number;
}) => [
  columnHelper.display({
    cell: (x) => x.row.index + 1 + pageIndex * pageSize,
    header: "N.",
  }),
  columnHelper.accessor("createdAt", {
    cell: (x) => <DateCell date={x.getValue()} />,
    header: "Created At",
    sortingFn: "datetime",
  }),
  columnHelper.accessor("hasConfirmed", {
    header: "Confirmed",
    cell: (x) => <BooleanCell isActive={x.getValue()} />,
  }),
  columnHelper.accessor("confirmationSentAt", {
    cell: (x) =>
      x.getValue() ? (
        <DateCell date={x.getValue() ?? new Date()} />
      ) : (
        <TextCell text="Not sent" />
      ),
    header: "Confirm email sent At",
    sortingFn: "datetime",
  }),
  columnHelper.accessor("email", {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: "Email",
  }),
  columnHelper.accessor("hasUnsubscribed", {
    header: "Unsubscribed",
    cell: (x) => <BooleanCell isActive={x.getValue()} />,
  }),
];
