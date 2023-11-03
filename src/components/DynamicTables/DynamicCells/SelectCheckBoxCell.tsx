import React from "react";
import { Checkbox } from "@chakra-ui/react";
import type { Row } from "@tanstack/react-table";
export default function SelectCheckBoxCell({
  selectedRows,
  setSelectedRows,
  row,
}: {
  row: Row<any>;
  selectedRows: any[];
  setSelectedRows: (rows: any[]) => void;
}) {
  const isChecked = selectedRows.some((x) => x.id === row.original.id);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Checkbox
        name="selectCheckbox"
        size="lg"
        isChecked={isChecked}
        onChange={(e) => {
          e.stopPropagation();
          if (isChecked) {
            setSelectedRows(
              selectedRows.filter((x) => x.id !== row.original.id)
            );
            return;
          }

          setSelectedRows([...selectedRows, row.original]);
        }}
      />
    </div>
  );
}
