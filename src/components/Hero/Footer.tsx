import {
  Box,
  chakra,
  Container,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  Image,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { siteData } from "@/lib/Constants/SiteData";
import { socialMediaLinks } from "@/lib/Constants/SocialMedia";

const Logo = () => {
  return (
    <Flex alignItems={"center"} gap={"10px"}>
      <Image
        src={siteData.logo}
        alt="logo"
        width={"20px"}
        height={"20px"}
        cursor="pointer"
        hideBelow={"md"}
      />
      <Text fontWeight={"bold"} fontSize={"2xl"}>
        {siteData.appName}
      </Text>
    </Flex>
  );
};

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
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

export default function LargeWithNewsletter() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid
          templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr 2fr" }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Logo />
            </Box>
            <Text fontSize={"sm"}>
              © {new Date().getFullYear()} {siteData.appName}. All rights
              reserved
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
                <SocialButton
                  label={"Instagram"}
                  href={socialMediaLinks.instagram}
                >
                  <FaInstagram />
                </SocialButton>
              )}
            </Stack>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Company</ListHeader>
            <Box as={Link} href={"/contact"}>
              Contact us
            </Box>
            <Box as={Link} href={"/#features"}>
              Features
            </Box>
            <Box as={Link} href={"/pricing"}>
              Pricing
            </Box>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Support</ListHeader>
            <Box as={Link} href={"/#faq"}>
              Faq
            </Box>
            <Box as={Link} href={"/terms-of-service"}>
              Terms of Service
            </Box>
            <Box as={Link} href={"/privacy-policy"}>
              Privacy Policy
            </Box>
            <Box as={Link} href={"/licence"}>
              Licence
            </Box>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Stay up to date</ListHeader>

            <Box as={Link} href={"/newsletter"}>
              Newsletter
            </Box>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
