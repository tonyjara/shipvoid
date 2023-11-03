import { Text } from "@chakra-ui/react";
import { format } from "date-fns";
import React from "react";

const MillisecondsCell = ({
  date,
  hideHours,
}: {
  date: Date;
  hideHours?: boolean;
}) => {
  return (
    <Text fontSize="md" fontWeight="bold" pb=".5rem">
      {format(date, hideHours ? "mmLss:SSSS" : "EEE hh:mm:ss.SSSS")}
    </Text>
  );
};

export default MillisecondsCell;
