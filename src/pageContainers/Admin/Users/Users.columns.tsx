import type { User } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import BooleanCell from "@/components/DynamicTables/DynamicCells/Boolean.cell";
import DateCell from "@/components/DynamicTables/DynamicCells/Date.cell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";

const columnHelper = createColumnHelper<User>();

export const usersColumns = ({
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
  columnHelper.accessor("active", {
    header: "Active",
    cell: (x) => <BooleanCell isActive={x.getValue()} />,
  }),
  columnHelper.accessor("createdAt", {
    cell: (x) => <DateCell date={x.getValue()} />,
    header: "Created At",
    sortingFn: "datetime",
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (x) => <TextCell text={x.getValue() ?? "-"} />,
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.accessor("emailVerified", {
    header: "VerifiedAt",
    cell: (x) => (x.getValue() ? <DateCell date={x.getValue()!} /> : "-"),
  }),
];
