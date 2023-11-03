import React from "react";
import { Text } from "@chakra-ui/react";

interface props {
  /* currency: Currency; */

  arrow?: "up" | "down";
}

const MoneyCell = ({}: props) => {
  return (
    <Text fontSize="sm" fontWeight="bold">
      {/* {arrow === "down" && <TriangleDownIcon color={"red.300"} mr={"2px"} />} */}
      {/* {arrow === "up" && <TriangleUpIcon color={"green.300"} mr={"2px"} />} */}
      {/**/}
      {/* {decimalFormat(amount, currency)} */}
    </Text>
  );
};

export default MoneyCell;
