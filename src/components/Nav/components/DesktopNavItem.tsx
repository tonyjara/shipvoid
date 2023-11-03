import { Link, Flex, Icon, IconButton, Text, Tooltip } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import type { IconType } from "react-icons";
interface NavItemProps {
  icon: IconType;
  dest: string; //destination
  minimized?: boolean;
  onClose?: () => void;
  name: string;
  target?: string;
}
const DesktopNavItem = ({
  icon,
  onClose,
  dest,
  minimized,
  name,
  target,
}: NavItemProps) => {
  const router = useRouter();
  const isCurrentLocation = router.asPath === dest;
  return (
    <Link
      onClick={() => onClose && onClose()}
      href={dest}
      style={{ textDecoration: "none" }}
      as={NextLink}
      target={target}
    >
      <Tooltip
        hasArrow
        openDelay={0}
        placement="auto"
        isDisabled={!minimized}
        label={name}
      >
        <Flex
          align="center"
          p="2"
          /* mx="4" */
          borderRadius="lg"
          role="group"
          cursor="pointer"
          justifyContent={minimized ? "center" : "left"}
        >
          <IconButton
            aria-label="icon"
            icon={<Icon as={icon} fontSize="20px" />}
            variant={isCurrentLocation && minimized ? "outline" : "ghost"}
          />

          <Text
            textDecor={isCurrentLocation ? "underline" : undefined}
            fontWeight={"semibold"}
            color={"brand.600"}
            _dark={{ color: "brand.400" }}
            pl={minimized ? 0 : 4}
            fontSize="lg"
          >
            {!minimized && name}
          </Text>
        </Flex>
      </Tooltip>
    </Link>
  );
};

export default DesktopNavItem;
