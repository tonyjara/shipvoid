import React from 'react';
import { Td } from '@chakra-ui/react';
import { MdCheckCircle, MdOutlineUnpublished } from 'react-icons/md';

const ActiveCell = ({ bool }: { bool: boolean }) => {
  return (
    <Td>
      {bool && <MdCheckCircle color="green" />}
      {!bool && <MdOutlineUnpublished color="red" />}
    </Td>
  );
};

export default ActiveCell;
