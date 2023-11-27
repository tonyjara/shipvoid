import { EditIcon, EmailIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Flex,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorMode,
  Portal,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { RxAvatar } from "react-icons/rx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { signOut } from "next-auth/react";
import { BiLogOutCircle } from "react-icons/bi";
import SupportTicketModal from "@/components/Modals/SupportTicket.modal";
import Link from "next/link";

const TopBarRightSection = () => {
  const router = useRouter();
  const user = useSession().data?.user;
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <SupportTicketModal isOpen={isOpen} onClose={onClose} />
      <Flex gap={{ base: "15px", md: "10px" }} alignItems={"center"}>
        <Button
          w="fit-content"
          hideBelow={"md"}
          as={Link}
          href={"/#demo"}
          variant="ghost"
        >
          Demo
        </Button>
        <Button
          w="fit-content"
          hideBelow={"md"}
          as={Link}
          href={"https://docs.transcribely.io"}
          target="_blank"
          variant="ghost"
        >
          Docs
        </Button>
        {user && (
          <>
            <Button
              w="fit-content"
              hideBelow={"md"}
              as={Link}
              href={"/downloads"}
              variant="ghost"
            >
              Downloads
            </Button>
            <Button w="fit-content" variant="ghost" onClick={onOpen}>
              Feedback
            </Button>
          </>
        )}
        {!user && (
          <Flex>
            <Button
              w="fit-content"
              hideBelow={"md"}
              as={Link}
              href={"/newsletter"}
              variant="ghost"
            >
              Newsletter
            </Button>
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
        <IconButton
          variant="ghost"
          onClick={toggleColorMode}
          aria-label="change color theme"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        />

        {user && (
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <Avatar size={"sm"} src={user.image ?? undefined} />
            </MenuButton>
            <Portal>
              <MenuList zIndex={"11"}>
                <MenuItem pointerEvents={"none"} icon={<RxAvatar />}>
                  {user.name}{" "}
                </MenuItem>

                <MenuItem pointerEvents={"none"} icon={<EmailIcon />}>
                  {user.email}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<EditIcon />}
                  onClick={() => router.push("/home/settings")}
                >
                  My Profile
                </MenuItem>

                <MenuDivider />
                <MenuItem icon={<BiLogOutCircle />} onClick={() => signOut()}>
                  Logout
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        )}
      </Flex>
    </>
  );
};

export default TopBarRightSection;
