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

export default function DrawerWithTopBar({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { status } = useSession();
  const authenticated = status === "authenticated";
  const [minimized, setMinimized] = useState(false);

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
      {authenticated && (
        <div>
          <DesktopSidebar minimized={minimized} setMinimized={setMinimized} />
          <MobileSidebar isOpen={isOpen} onClose={onClose} />
        </div>
      )}

      {!authenticated && (
        <UnauthenticatedMobileSideBar isOpen={isOpen} onClose={onClose} />
      )}
      <TopBar authenticated={authenticated} onOpen={onOpen} />

      <Box
        pt={"65px"}
        ml={
          !authenticated
            ? { base: 0 }
            : { base: 0, md: minimized ? "60px" : 60 }
        }
      >
        {children}
      </Box>
    </Box>
  );
}
