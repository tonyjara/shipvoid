import { Box } from "@chakra-ui/react";
import React from "react";

// Standardize page padding
const PageContainer = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  id?: string;
}) => {
  return (
    <Box
      id={id}
      className={className}
      px={{ base: 3, md: 5 }}
      py={{ base: 3, md: 3 }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;
