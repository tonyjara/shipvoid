import React from "react";
import { Text } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

interface props {
  value: number;
  arrow?: "up" | "down";
}

const NumberCell = ({ value, arrow }: props) => {
  return (
    <Text fontSize="sm" fontWeight="bold">
      <>
        {arrow === "down" && <TriangleDownIcon color={"red.300"} mr={"2px"} />}
        {arrow === "up" && <TriangleUpIcon color={"green.300"} mr={"2px"} />}
        {value.toLocaleString("en-US")}
      </>
    </Text>
  );
};

export default NumberCell;
