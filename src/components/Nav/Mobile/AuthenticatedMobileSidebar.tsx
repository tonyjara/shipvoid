import { siteData } from "@/lib/Constants/SiteData";
import {
  Button,
  Drawer,
  DrawerContent,
  Heading,
  Image,
  VStack,
} from "@chakra-ui/react";
import { useColorModeValue, Flex, CloseButton, Box } from "@chakra-ui/react";
import Link from "next/link";
interface SidebarProps {
  onClose: () => void;
  isOpen: boolean;
}

const AuthenticatedMobileSidebar = ({ onClose, isOpen }: SidebarProps) => {
  return (
    <Drawer
      autoFocus={false}
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      returnFocusOnClose={false}
      onOverlayClick={onClose}
      size="full"
    >
      <DrawerContent>
        <Box
          zIndex={2}
          transition="0.2s ease"
          bg={useColorModeValue("white", "gray.900")}
          borderRight="1px"
          borderRightColor={useColorModeValue("gray.200", "gray.700")}
          w={"full"}
          pos="fixed"
          h="full"
          overflowY={"auto"}
          display={{ base: "block", md: "none" }}
        >
          <Flex
            h="20"
            alignItems="center"
            px={4}
            justifyContent="space-between"
          >
            <Link href={"/"}>
              <Image
                boxSize={"30px"}
                objectFit="cover"
                src={siteData.logo}
                alt="Logo image"
                onClick={onClose}
              />
            </Link>

            <Heading>{siteData.appName}</Heading>
            <CloseButton onClick={onClose} />
          </Flex>
          <VStack
            top={0}
            left={0}
            right={0}
            flexDirection="column"
            p={2}
            pb={4}
            m={2}
            spacing={3}
            rounded="sm"
            shadow="sm"
          >
            <Button
              onClick={onClose}
              w="full"
              as={Link}
              href={"/"}
              variant="ghost"
            >
              Home
            </Button>
            <Button
              onClick={onClose}
              w="full"
              as={Link}
              href={"https://docs.transcribely.io"}
              target="_blank"
              variant="ghost"
            >
              Docs
            </Button>
            <Button
              onClick={onClose}
              w="full"
              as={Link}
              href={"/downloads"}
              variant="ghost"
            >
              Downloads
            </Button>
          </VStack>
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default AuthenticatedMobileSidebar;
