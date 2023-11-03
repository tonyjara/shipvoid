import { IconButton, Image, useColorMode } from "@chakra-ui/react";
import { AccordionIcon } from "@chakra-ui/react";
import { AccordionPanel } from "@chakra-ui/react";
import { Accordion, AccordionButton, AccordionItem } from "@chakra-ui/react";
import { useColorModeValue, Flex, Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { TbChevronsLeft, TbLayoutSidebarRightCollapse } from "react-icons/tb";
import DesktopNavItem from "../components/DesktopNavItem";
import NavItemChild from "../components/NavItemChild";
import { SidebarLinks } from "../Data/SidebarLinks";
import Link from "next/link";
interface SidebarProps {
  minimized: boolean;
  setMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesktopSidebar = ({ minimized, setMinimized }: SidebarProps) => {
  const user = useSession().data?.user;
  const { colorMode } = useColorMode();
  const logo =
    colorMode === "light"
      ? "/assets/logo/black-logo.png"
      : "/assets/logo/white-logo.png";

  return (
    <Box
      zIndex={2}
      transition="0.2s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ md: minimized ? "60px" : 60 }}
      pos="fixed"
      h="full"
      overflowY={"hidden"}
      display={{ base: "none", md: "block" }}
      justifyContent="center"
    >
      <Flex
        alignItems="center"
        justifyContent={"center"}
        flexDir={"column"}
        mb={"5px"}
      >
        <Link href={"/home"}>
          <Image
            mt={"-5px"}
            mb={"30px"}
            boxSize={"30px"}
            objectFit="cover"
            src={logo}
            alt="Logo image"
          />
        </Link>
        {/* Open sidebar button */}
      </Flex>

      {user &&
        SidebarLinks(user).map((link) => (
          <div key={link.name}>
            {link.children?.length && (
              <Accordion allowToggle>
                <AccordionItem>
                  {/* the column fixes annoying margin leftrover when minimized */}
                  <Flex
                    flexDir={minimized ? "column" : "row"}
                    justifyContent="space-between"
                  >
                    <DesktopNavItem
                      minimized={minimized}
                      icon={link.icon}
                      dest={link.dest}
                      name={link.name}
                      target={link.target}
                    />

                    <AccordionButton
                      display={minimized ? "none" : "flex"}
                      justifyContent={minimized ? "center" : "right"}
                    >
                      {!minimized && <AccordionIcon />}
                    </AccordionButton>
                  </Flex>
                  {link.children.map((x) => (
                    <AccordionPanel key={x.name}>
                      <NavItemChild
                        icon={x.icon}
                        name={x.name}
                        dest={x.dest}
                        minimized={minimized}
                        target={link.target}
                      />
                    </AccordionPanel>
                  ))}
                </AccordionItem>
              </Accordion>
            )}
            {!link.children?.length && (
              <DesktopNavItem
                name={link.name}
                minimized={minimized}
                icon={link.icon}
                dest={link.dest}
                target={link.target}
              />
            )}
          </div>
        ))}
      <Flex
        w="100%"
        h="55px"
        alignItems="center"
        pr={minimized ? "0px" : "5px"}
        gap={2}
        justifyContent={minimized ? "center" : "end"}
      >
        <IconButton
          aria-label="close drawer"
          display={{ base: "none", md: "flex" }}
          onClick={() => setMinimized(!minimized)}
          icon={
            minimized ? (
              <TbLayoutSidebarRightCollapse style={{ fontSize: "25px" }} />
            ) : (
              <TbChevronsLeft style={{ fontSize: "25px" }} />
            )
          }
          variant="ghost"
        />
      </Flex>
    </Box>
  );
};

export default DesktopSidebar;
