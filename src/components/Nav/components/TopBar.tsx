import {
  Image,
  Flex,
  useColorModeValue,
  IconButton,
  useColorMode,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";
import TopBarRightSection from "./TopBarRightSection";

interface MobileProps {
  onOpen: () => void;
  authenticated: boolean;
}
const TopBar = ({ onOpen, authenticated }: MobileProps) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const logo =
    colorMode === "light"
      ? "/assets/logo/black-logo.png"
      : "/assets/logo/white-logo.png";

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
      justifyContent={{
        base: "space-between",
        md: "space-between",
      }}
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
          src={logo}
          alt="logo"
          width={"30px"}
          height={"30px"}
          cursor="pointer"
          hideBelow={"md"}
        />
      </div>
      <Flex alignItems={"center"}>
        {!authenticated && (
          <Flex>
            <Button
              hideBelow={"md"}
              as={Link}
              href={"/pricing"}
              variant="ghost"
            >
              Pricing
            </Button>
            <Button as={Link} href={"/signin"} variant="ghost">
              Sign in
            </Button>
          </Flex>
        )}

        <TopBarRightSection />
      </Flex>
    </Flex>
  );
};

export default TopBar;
