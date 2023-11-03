import React from 'react';
import { MdCheckCircle, MdOutlineUnpublished } from 'react-icons/md';

const BooleanCell = ({ isActive }: { isActive: boolean }) => {
  return (
    <>
      {isActive && <MdCheckCircle color="green" />}
      {!isActive && <MdOutlineUnpublished color="red" />}
    </>
  );
};

export default BooleanCell;
