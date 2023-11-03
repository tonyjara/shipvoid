import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import {
  Flex,
  Text,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

const TablePagination = <T extends object>({
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  count,
  data,
  noBg,
}: {
  data?: T[];
  pageIndex: number;
  noBg?: boolean;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  count: number;
}) => {
  const nextPage = () => setPageIndex(pageIndex + 1);
  const previousPage = () => setPageIndex(pageIndex - 1);
  const canNextPage = data?.length === pageSize;
  const canPreviousPage = pageIndex > 0;
  const gotoPage = (x: number) => setPageIndex(x);
  const lastPage = Math.ceil(count / pageSize);
  const bgColor = useColorModeValue("gray.50", "gray.700");
  return (
    <Flex
      justifyContent="center"
      p={"10px"}
      bg={noBg ? undefined : bgColor}
      overflowX={"auto"}
      borderBottomRadius={"md"}
    >
      <Flex gap={"10px"} maxW="750px" w={"100%"}>
        <Flex>
          <IconButton
            onClick={() => gotoPage(0)}
            isDisabled={!canPreviousPage}
            icon={<ArrowLeftIcon h={3} w={3} />}
            mr={4}
            aria-label={""}
          />

          <IconButton
            onClick={previousPage}
            isDisabled={!canPreviousPage}
            icon={<ChevronLeftIcon h={6} w={6} />}
            aria-label={""}
          />
        </Flex>

        <Flex alignItems="center">
          <Text whiteSpace={"nowrap"} mr={8}>
            Page{" "}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{" "}
            of{" "}
            <Text fontWeight="bold" as="span">
              {lastPage}
            </Text>
          </Text>
          <Text whiteSpace={"nowrap"}>Go to page:</Text>{" "}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={lastPage}
            onChange={(value) => {
              const page = value ? parseInt(value) - 1 : 0;
              gotoPage(page);
            }}
            defaultValue={pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            // minW="130px"
          >
            {[10, 20, 30, 40, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex>
          <IconButton
            onClick={nextPage}
            isDisabled={!canNextPage}
            icon={<ChevronRightIcon h={6} w={6} />}
            aria-label={""}
          />

          <IconButton
            onClick={() => {
              gotoPage(lastPage - 1);
            }}
            isDisabled={!canNextPage}
            icon={<ArrowRightIcon h={3} w={3} />}
            ml={4}
            aria-label={""}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TablePagination;
