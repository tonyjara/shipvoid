import { createColumnHelper } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";
import NumberCell from "../../../components/DynamicTables/DynamicCells/NumberCell";
import BooleanCell from "../../../components/DynamicTables/DynamicCells/Boolean.cell";
import DateCell from "../../../components/DynamicTables/DynamicCells/Date.cell";
import TextCell from "../../../components/DynamicTables/DynamicCells/TextCell";

type CouponsWithSubscriptionUser = Prisma.CouponsGetPayload<{
  include: {
    subscription: {
      select: {
        user: { select: { email: true } };
      };
    };
  };
}>;

const columnHelper = createColumnHelper<CouponsWithSubscriptionUser>();

export const couponsColumns = ({
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

  columnHelper.accessor("chatInputCredits", {
    cell: (x) => <NumberCell value={x.getValue()} />,
    header: "Chat I. Credits",
    sortingFn: "text",
  }),
  columnHelper.accessor("chatOutputCredits", {
    cell: (x) => <NumberCell value={x.getValue()} />,
    header: "Chat O. Credits",
    sortingFn: "text",
  }),

  columnHelper.accessor("transcriptionMinutes", {
    cell: (x) => <NumberCell value={x.getValue()} />,
    header: "Transcription M.",
    sortingFn: "text",
  }),

  columnHelper.accessor("hasBeenClaimed", {
    cell: (x) => <BooleanCell isActive={x.getValue()} />,
    header: "Claimed",
  }),

  columnHelper.display({
    cell: (x) => {
      const userEmail = x.row.original?.subscription?.user.email ?? "-";
      return <TextCell text={userEmail} />;
    },
    header: "Claimed By",
    sortingFn: "text",
  }),
  columnHelper.accessor("expirationDate", {
    cell: (x) =>
      x.getValue() ? <DateCell date={x.getValue()!} /> : <TextCell text="-" />,
    header: "Expiration Date",
    sortingFn: "datetime",
  }),

  columnHelper.accessor("couponCode", {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: "Coupon Code",
    sortingFn: "text",
  }),
];
