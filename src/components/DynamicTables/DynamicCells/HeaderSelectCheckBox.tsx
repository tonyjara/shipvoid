import React from "react";
import { Checkbox } from "@chakra-ui/react";
import type { Table } from "@tanstack/react-table";
export default function HeaderSelectCheckBox({
  selectedRows,
  setSelectedRows,
  table,
  pageSize,
  rowsLength,
}: {
  table: Table<any>;
  selectedRows: any[];
  setSelectedRows: (rows: any[]) => void;
  pageSize: number;
  rowsLength: number;
}): JSX.Element {
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < pageSize;
  const isAllChecked = selectedRows.length >= rowsLength && rowsLength > 0;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        const isAllChecked = selectedRows.length >= rowsLength;
        if (isAllChecked) {
          setSelectedRows([]);
          return;
        }
        let rows: any[] = [];
        table.getRowModel().rows.forEach((row: any) => {
          rows.push(row.original);
        });
        setSelectedRows(rows);
      }}
    >
      <Checkbox
        name="chckbox"
        size="lg"
        isIndeterminate={isIndeterminate}
        isChecked={isAllChecked}
      />
    </div>
  );
}
