import { Button } from "@chakra-ui/react";
import { type Column } from "@tanstack/react-table";
import React from "react";
import InputContainsColumnFilter from "./ColumnFilters/InputContains.columnFilter";

export interface ColumnFilterProps {
  keyName?: string;
  column: Column<any>;
  whereFilterList: any[];
  setWhereFilterList?: React.Dispatch<React.SetStateAction<any[]>>;
}

/** 
This component lists filters that are specific to a column.
They change the way the "where" query is executed inside prisma to give server filtering.
*/
const ColumnFilter = (props: ColumnFilterProps) => {
  const { column, setWhereFilterList, whereFilterList } = props;

  return (
    <div>
      {column.id === "id" && (
        <Button
          size={"sm"}
          isDisabled={!whereFilterList.length}
          onClick={() => setWhereFilterList && setWhereFilterList([])}
        >
          Clear
        </Button>
      )}
      {column.id === "name" && (
        <InputContainsColumnFilter keyName="name" {...props} />
      )}{" "}
      {column.id === "description" && (
        <InputContainsColumnFilter keyName="description" {...props} />
      )}{" "}
      {column.id === "transcription" && (
        <InputContainsColumnFilter keyName="transcription" {...props} />
      )}{" "}
      {column.id === "userContent" && (
        <InputContainsColumnFilter keyName="userContent" {...props} />
      )}{" "}
    </div>
  );
};

export default ColumnFilter;
