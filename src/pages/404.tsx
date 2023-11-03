import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function NotFound() {
  const router = useRouter();
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, brand.400, brand.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you&apos;re looking for does not seem to exist
      </Text>

      <Button
        onClick={() => router.push("/home")}
        bgGradient="linear(to-r, brand.400, brand.500)"
        color="white"
        variant="solid"
      >
        Retun home{" "}
      </Button>
    </Box>
  );
}
