import { Box, Skeleton, Stack, Td, Tr } from '@chakra-ui/react';
import React from 'react';

const SkeletonRows = () => {
  return (
    <Tr>
      <Td colSpan={100}>
        <Stack>
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i}>
              <Box height={'80px'}></Box>
            </Skeleton>
          ))}
        </Stack>
      </Td>
    </Tr>
  );
};

export default SkeletonRows;
