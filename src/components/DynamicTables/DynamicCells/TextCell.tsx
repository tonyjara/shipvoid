import React from "react";
import { Text, Tooltip } from "@chakra-ui/react";

const TextCell = ({
  text,
  shortenString,
  color,
}: {
  text?: string;
  hover?: string | React.ReactNode;
  shortenString?: boolean;
  color?: string;
}) => {
  return (
    <>
      {shortenString ? (
        <Tooltip label={text}>
          <Text
            color={color}
            style={
              shortenString
                ? {
                    textOverflow: "ellipsis",
                    width: "100px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }
                : {}
            }
            fontSize="sm"
            fontWeight="bold"
          >
            {text}
          </Text>
        </Tooltip>
      ) : (
        <Text color={color} fontSize="sm" fontWeight="bold">
          {text}
        </Text>
      )}
    </>
  );
};

export default TextCell;
