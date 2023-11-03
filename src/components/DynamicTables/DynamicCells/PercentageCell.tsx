import React from "react";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import type Decimal from "decimal.js";

export const percentageCellUtil = (executed: Decimal, total: Decimal) =>
  executed.dividedBy(total).times(100).toFixed(0);

const PercentageCell = ({
  total,
  executed,
}: {
  total: Decimal;
  executed: Decimal;
}) => {
  const percentage = percentageCellUtil(executed, total);

  {
    /* <Tooltip label={decimalFormat(executed, currency)}> */
  }
  return (
    <CircularProgress
      value={isNaN(parseInt(percentage)) ? 0 : parseInt(percentage)}
      color={parseInt(percentage) < 100 ? "orange.400" : "green.400"}
    >
      <CircularProgressLabel>
        {isNaN(parseInt(percentage)) ? "0" : percentage}%
      </CircularProgressLabel>
    </CircularProgress>
  );
};

export default PercentageCell;
