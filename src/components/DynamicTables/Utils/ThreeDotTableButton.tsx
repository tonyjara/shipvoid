import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import type { TableOptions } from '../DynamicTable';

const ThreeDotTableButton = ({ options }: { options?: TableOptions[] }) => {
  return (
    <div>
      {options?.length && (
        <Menu>
          <MenuButton
            as={IconButton}
            maxW="40px"
            aria-label="options button"
            icon={<BsThreeDots />}
          />

          <MenuList>
            {options.map((x) => (
              <MenuItem key={x.label} onClick={x.onClick}>
                {x.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </div>
  );
};

export default ThreeDotTableButton;
