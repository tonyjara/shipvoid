import { createColumnHelper } from "@tanstack/react-table";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import { Prisma } from "@prisma/client";
import DateCell from "@/components/DynamicTables/DynamicCells/Date.cell";

export const ScribesHomePageArgs =
  Prisma.validator<Prisma.ScribeFindManyArgs>()({
    include: {
      audioFiles: {
        select: { duration: true },
      },
    },
  });

type ScribesForColumn = Prisma.ScribeGetPayload<typeof ScribesHomePageArgs>;

const columnHelper = createColumnHelper<ScribesForColumn>();

export const scribesPageColumns = () => [
  columnHelper.accessor("id", {
    cell: (x) => `# ${x.getValue()}` ?? "-",
    header: "№",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("createdAt", {
    cell: (x) =>
      x.getValue() ? <DateCell date={x.getValue() ?? new Date()} /> : "-",
    header: "Created",
    sortingFn: "datetime",
  }),
  columnHelper.accessor("name", {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: "Name",
    sortingFn: "text",
  }),
  columnHelper.accessor("description", {
    cell: (x) => <TextCell shortenString text={x.getValue()} />,
    header: "Description",
    sortingFn: "text",
  }),
  columnHelper.accessor("userContent", {
    cell: (x) => <TextCell shortenString text={x.getValue()} />,
    header: "Scribe",
    sortingFn: "text",
  }),
  columnHelper.accessor("transcription", {
    cell: (x) => <TextCell shortenString text={x.getValue()} />,
    header: "Transcription",
    sortingFn: "text",
  }),
];
