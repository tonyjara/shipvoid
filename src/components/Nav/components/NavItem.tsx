import { Flex, Icon } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import type { IconType } from "react-icons";
interface NavItemProps {
  icon: IconType;
  children: React.ReactNode;
  dest: string; //destination
  onClose?: () => void;
  target?: string;
}
const NavItem = ({ target, icon, onClose, children, dest }: NavItemProps) => {
  return (
    <Link
      onClick={() => onClose && onClose()}
      href={dest}
      style={{ textDecoration: "none" }}
      target={target}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "brand.400",
          color: "white",
        }}
        justifyContent={"left"}
      >
        {icon && (
          <Icon
            mr={"4"}
            fontSize="20px"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

export default NavItem;
