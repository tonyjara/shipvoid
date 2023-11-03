import { Box } from "@chakra-ui/react";
import React from "react";

// Standardize page padding
const PageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}) => {
  return (
    <Box className={className} px={{ base: 3, md: 5 }} py={{ base: 3, md: 3 }}>
      {children}
    </Box>
  );
};

export default PageContainer;
