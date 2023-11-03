import React from "react";
import { Text } from "@chakra-ui/react";

const EnumTextCell = ({
  text,
  enumFunc,
}: {
  text: string;
  hover?: string;
  enumFunc: (x: any) => string;
}) => {
  {
    /* <Tooltip label={hover}> */
  }
  return (
    <Text fontSize="sm" fontWeight="bold">
      {enumFunc(text)}
    </Text>
  );
};

export default EnumTextCell;
