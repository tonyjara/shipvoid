import { ChevronDownIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
import {
  InputGroup,
  Input,
  InputRightElement,
  Text,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  Menu,
} from "@chakra-ui/react";
import React from "react";

const TableSearchbar = ({
  searchValue,
  setSearchValue,
  type,
  placeholder,
  helperText,
  filterOptions,
  filterValue,
  setFilterValue,
}: {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  filterValue: string;
  setFilterValue: React.Dispatch<React.SetStateAction<string>>;
  type: "text" | "number";
  placeholder: string;
  helperText?: string;
  filterOptions?: { value: string; label: string }[];
}) => {
  const hasLength = !!searchValue.length;

  const filterLabel =
    filterOptions?.find((x) => x.value === filterValue)?.label ?? "Id";

  const onChange = (e: any) => {
    setSearchValue(e?.target.value ?? "");
  };

  return (
    <Flex
      gap={{ base: "0px", md: "20px" }}
      ml={{ base: "0px", md: "10px" }}
      w="100%"
      flexDir={{ base: "column-reverse", md: "row" }}
    >
      <InputGroup
        mt={{ base: "5px", md: "0px" }}
        maxW={"250px"}
        flexDir={"column"}
      >
        <Input
          type={type}
          value={searchValue}
          onChange={onChange}
          /* onChange={(x) => setSearchValue(x.target.value)} */
          variant={"flushed"}
          placeholder={placeholder + " " + filterLabel}
        />
        <InputRightElement
          onClick={() => hasLength && setSearchValue("")}
          cursor={hasLength ? "pointer" : "auto"}
        >
          {hasLength ? <CloseIcon /> : <Search2Icon />}
        </InputRightElement>
        <Text color={"gray.500"}>{helperText}</Text>
      </InputGroup>
      {filterOptions?.length && (
        <Menu>
          <MenuButton
            maxW={"250px"}
            minW={"150px"}
            whiteSpace={"normal"}
            height={"auto"}
            textAlign={"left"}
            py={{ base: "5px", md: "0px" }}
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            Filtro:{" "}
            {filterOptions?.find((x) => x.value === filterValue)?.label ?? ""}
          </MenuButton>
          <MenuList>
            {filterOptions?.map((x) => (
              <MenuItem onClick={() => setFilterValue(x.value)} key={x.value}>
                {x.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};

export default TableSearchbar;
