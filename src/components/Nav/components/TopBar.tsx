import { Image, Flex, useColorModeValue, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiMenu } from "react-icons/fi";
import TopBarRightSection from "./TopBarRightSection";
import { siteData } from "@/lib/Constants/SiteData";

interface MobileProps {
  onOpen: () => void;
}
const TopBar = ({ onOpen }: MobileProps) => {
  const router = useRouter();

  return (
    <Flex
      id="top"
      position={"fixed"}
      width="100%"
      zIndex={3}
      px={{ base: 4, md: 4 }}
      height="65px"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "transparent")}
      justifyContent={"space-between"}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <IconButton
          hideFrom={"md"}
          onClick={onOpen}
          variant="ghost"
          aria-label="open menu"
          icon={<FiMenu />}
        />
        <Image
          onClick={() => router.push("/")}
          src={siteData.logo}
          alt="logo"
          width={"30px"}
          height={"30px"}
          cursor="pointer"
          hideBelow={"md"}
        />
      </div>

      <TopBarRightSection />
    </Flex>
  );
};

export default TopBar;
