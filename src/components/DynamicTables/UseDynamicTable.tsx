import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";

// Stores state that the dynamic table component needs.

export const useDynamicTable = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(30);
  const [sorting, setSorting] = useState<SortingState>([]);
  return {
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    sorting,
    setSorting,
  };
};
