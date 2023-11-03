import {
  Drawer,
  DrawerContent,
  Heading,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import { AccordionIcon } from "@chakra-ui/react";
import { AccordionPanel } from "@chakra-ui/react";
import { Accordion, AccordionButton, AccordionItem } from "@chakra-ui/react";
import { useColorModeValue, Flex, CloseButton, Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import NavItem from "../components/NavItem";
import NavItemChild from "../components/NavItemChild";
import { SidebarLinks } from "../Data/SidebarLinks";
import Link from "next/link";
import { siteData } from "@/lib/Constants";
interface SidebarProps {
  onClose: () => void;
  isOpen: boolean;
}

const MobileSidebar = ({ onClose, isOpen }: SidebarProps) => {
  const user = useSession().data?.user;

  const { colorMode } = useColorMode();
  const logo = colorMode === "light" ? siteData.blackLogo : siteData.whiteLogo;
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
            mx="24px"
            justifyContent="space-between"
          >
            <Link href={"/home"}>
              <Image
                boxSize={"30px"}
                objectFit="cover"
                src={logo}
                alt="Logo image"
              />
            </Link>

            <Heading>{siteData.appName}</Heading>
            <CloseButton onClick={onClose} />
          </Flex>

          {user &&
            SidebarLinks(user).map((link) => (
              <div key={link.name}>
                {/* Icons with children such as Admin*/}
                {link.children?.length && (
                  <Accordion allowToggle>
                    <AccordionItem as={"div"}>
                      <Flex>
                        <NavItem
                          onClose={onClose}
                          icon={link.icon}
                          dest={link.dest}
                          target={link.target}
                        >
                          {link.name}
                        </NavItem>
                        <AccordionButton justifyContent={"left"}>
                          {<AccordionIcon />}
                        </AccordionButton>
                      </Flex>
                      {link.children.map((x) => (
                        <AccordionPanel key={x.name}>
                          <NavItemChild
                            icon={x.icon}
                            name={x.name}
                            dest={x.dest}
                            onClose={onClose}
                            target={link.target}
                          />
                        </AccordionPanel>
                      ))}
                    </AccordionItem>
                  </Accordion>
                )}
                {/* Standalone icons such as setting */}
                {!link.children?.length && (
                  <NavItem
                    target={link.target}
                    onClose={onClose}
                    icon={link.icon}
                    dest={link.dest}
                  >
                    {link.name}
                  </NavItem>
                )}
              </div>
            ))}
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileSidebar;
