import type { ReactNode } from "react";
import { useEffect } from "react";
import { useState } from "react";
import React from "react";
import { Box, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import DesktopSidebar from "./Desktop/DesktopSidebar";
import MobileSidebar from "./Mobile/MobileSidebar";
import UnauthenticatedMobileSideBar from "./Mobile/UnathenticatedMobileSideBar";
import TopBar from "./components/TopBar";
import { useLazyEffect } from "@/lib/hooks/useLazyEffect";
import AuthenticatedMobileSidebar from "./Mobile/AuthenticatedMobileSidebar";

export default function DrawerWithTopBar({
  children,
}: {
  children: ReactNode;
}) {
  const [minimized, setMinimized] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const session = useSession();
  const authenticated = session.status === "authenticated";
  const isAdmin = session.data?.user.role === "admin";

  useEffect(() => {
    const isMinimized = JSON.parse(
      localStorage.getItem("sidebarToggle") ?? "false",
    );
    setMinimized(isMinimized);

    return () => {};
  }, []);

  useLazyEffect(() => {
    localStorage.setItem("sidebarToggle", JSON.stringify(minimized));
    return () => {};
  }, [minimized]);

  return (
    <Box w="100%" minH={"100vh"}>
      {authenticated && isAdmin && (
        <div>
          <DesktopSidebar minimized={minimized} setMinimized={setMinimized} />
          <MobileSidebar isOpen={isOpen} onClose={onClose} />
        </div>
      )}

      {!authenticated && (
        <UnauthenticatedMobileSideBar isOpen={isOpen} onClose={onClose} />
      )}
      {authenticated && !isAdmin && (
        <AuthenticatedMobileSidebar isOpen={isOpen} onClose={onClose} />
      )}
      <TopBar onOpen={onOpen} />

      <Box
        pt={"65px"}
        ml={
          !authenticated || !isAdmin
            ? { base: 0 }
            : { base: 0, md: minimized ? "60px" : 60 }
        }
      >
        {children}
      </Box>
    </Box>
  );
}
