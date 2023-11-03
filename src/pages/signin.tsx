import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  Link as ChakraLink,
  Text,
  useColorModeValue,
  Center,
  Divider,
} from "@chakra-ui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormControlledText from "@/components/Forms/FormControlled/FormControlledText";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "@/server/auth";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { myToast } from "@/components/Alerts/MyToast";
import router from "next/router";
import { appOptions, siteData } from "@/lib/Constants";
import { FcGoogle } from "react-icons/fc";

interface SigninFormValues {
  email: string;
  password: string;
}
const validateSignin = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SimpleCard() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(validateSignin),
  });

  const handleGoogleSigning = async () => {
    await signIn("google");
  };
  const submitFunc = async ({ email, password }: SigninFormValues) => {
    const postSignin = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (postSignin?.error) {
      //handle
      console.error(postSignin.error);
      if (appOptions.heroScreenType === "maintenance") {
        return myToast.error(
          "The app is currently under maintenance, please try again later",
        );
      }
      return myToast.error(
        "Error signing in, please check your credentials and try again",
      );
    }
    reset();
    router.push("/home");
  };

  const headingColor = useColorModeValue("brand.500", "brand.400");
  return (
    <Flex
      minH={"92vh"}
      flexDir={"column"}
      align={"center"}
      justify={"start"}
      bg={useColorModeValue("gray.50", "gray.800")}
      w="full"
      px="20px"
    >
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <Stack spacing={8} py={{ base: 6, md: 12 }}>
          <Heading color={headingColor} fontSize={"4xl"} textAlign={"center"}>
            Sign in to {siteData.appName}
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={{ base: "none", md: "lg" }}
          p={5}
          minW={{ base: "full", md: "lg" }}
          maxW="xl"
        >
          <Button
            color={"gray.800"}
            _dark={{ color: "white" }}
            w={"full"}
            variant={"outline"}
            leftIcon={<FcGoogle />}
            mt={"10px"}
            onClick={handleGoogleSigning}
          >
            <Center>
              <Text>Continue with Google</Text>
            </Center>
          </Button>

          <Flex gap={"10px"} pb={"20px"} pt={"30px"} alignItems={"center"}>
            <Divider />
            <Text color={"gray.500"}>OR</Text>
            <Divider />
          </Flex>
          <Stack spacing={8}>
            <FormControlledText
              isRequired
              control={control}
              name="email"
              label="Email"
              errors={errors}
            />

            <FormControlledText
              isRequired
              control={control}
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              errors={errors}
              inputRight={
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              }
            />
            <Button
              type="submit"
              isDisabled={isSubmitting}
              color={"white"}
              _dark={{ color: "gray.800" }}
              _hover={{
                bg: "brand.600",
              }}
            >
              Sign in
            </Button>
          </Stack>

          <Flex flexDir={"column"} pt="50px">
            <ChakraLink
              color="brand.600"
              _dark={{ color: "brand: 400" }}
              as={Link}
              /* pb="10px" */
              href="/forgot-my-password"
            >
              Forgot your password?
            </ChakraLink>

            <ChakraLink
              mt="10px"
              color="brand.600"
              _dark={{ color: "brand: 400" }}
              as={Link}
              href="/signup"
            >
              Sign up for a free {siteData.appName} account
            </ChakraLink>
          </Flex>
        </Box>
      </form>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};
