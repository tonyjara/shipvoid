import React, { useEffect, useState } from "react";
import { ColumnFilterProps } from "../ColumnFilter";
import { Prisma } from "@prisma/client";
import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import useDebounce from "@/lib/hooks/useDebounce";
import { CloseIcon } from "@chakra-ui/icons";

const InputContainsColumnFilter = ({
  setWhereFilterList,
  whereFilterList,
  keyName,
}: ColumnFilterProps) => {
  const [searchValue, setSearchValue] = useState("");

  const filterListValue = keyName
    ? whereFilterList.filter((x) => x[keyName])[0]?.[keyName].contains
    : "";

  const debouncedSearchValue = useDebounce(searchValue ?? "", 500);

  //This clears the input when the borrar filtros button is pressed
  useEffect(() => {
    if (!filterListValue?.length && debouncedSearchValue?.length) {
      setSearchValue("");
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterListValue]);

  const whereBuilder = (val: string) =>
    //@ts-ignore
    Prisma.validator<Prisma.MoneyRequestScalarWhereInput>()({
      [keyName as string]: { contains: val, mode: "insensitive" },
    });

  useEffect(() => {
    if (!setWhereFilterList) return;
    setWhereFilterList((prev) =>
      prev.filter((x) => (keyName ? !x[keyName] : true)),
    );
    if (!debouncedSearchValue.length) return;

    setWhereFilterList((prev) => [...prev, whereBuilder(debouncedSearchValue)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  const handleChange = (e: any) => {
    setSearchValue(e.target.value);
  };
  const handleClear = () => {
    setSearchValue("");
  };

  return (
    <div style={{ minWidth: "130px" }} onClick={(e) => e.stopPropagation()}>
      <InputGroup size="md">
        <Input
          borderRadius={"md"}
          value={searchValue}
          size={"sm"}
          onChange={handleChange}
        />
        <InputRightElement>
          <IconButton
            mt={"-7px"}
            aria-label="Clear input"
            hidden={!searchValue.length}
            size="sm"
            icon={<CloseIcon />}
            onClick={handleClear}
            variant={"ghost"}
          />
        </InputRightElement>
      </InputGroup>
    </div>
  );
};

export default InputContainsColumnFilter;
