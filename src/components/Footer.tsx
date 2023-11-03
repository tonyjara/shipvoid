import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { ReactNode } from "react";
import Link from "next/link";
import { siteData, socialMediaLinks } from "@/lib/Constants";

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      as={Link}
      target="_blank"
      cursor={"pointer"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("brand.600", "brand.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  return (
    <Box
      position="absolute"
      bottom="0px"
      width="100%"
      zIndex={1000}
      bg={useColorModeValue("brand.600", "gray.900")}
      color={useColorModeValue("white", "gray.200")}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>
          © {new Date().getFullYear()} {siteData.appName}. All rights reserved
        </Text>
        <Stack direction={"row"} spacing={6}>
          {socialMediaLinks.twitter.length && (
            <SocialButton label={"Twitter"} href={socialMediaLinks.twitter}>
              <FaTwitter />
            </SocialButton>
          )}
          {socialMediaLinks.youtube.length && (
            <SocialButton label={"YouTube"} href={socialMediaLinks.youtube}>
              <FaYoutube />
            </SocialButton>
          )}
          {socialMediaLinks.instagram.length && (
            <SocialButton label={"Instagram"} href={socialMediaLinks.instagram}>
              <FaInstagram />
            </SocialButton>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
