import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormControlledText from "@/components/Forms/FormControlled/FormControlledText";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import { trpcClient } from "@/utils/api";
import { handleUseMutationAlerts, myToast } from "@/components/Alerts/MyToast";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { verifyToken } from "@/lib/utils/asyncJWT";
import { prisma } from "@/server/db";
import {
  VerifyFormValues,
  validateVerify,
} from "@/lib/Validations/Verify.validate";

interface SignupCardProps {
  email: string;
  name: string;
  linkId: string;
}

export default function SignupCard(props: { data: SignupCardProps }) {
  const {
    data: { email, name, linkId },
  } = props;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    defaultValues: {
      email,
      name,
      password: "",
      confirmPassword: "",
      linkId,
    },
    resolver: zodResolver(validateVerify),
  });

  const { mutate, isLoading } =
    trpcClient.auth.signupWithCredentials.useMutation(
      handleUseMutationAlerts({
        successText: "Account created successfully!",
        callback: async () => {
          const values = getValues();
          const x = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
          });

          if (!x?.error) {
            //redirect
            router.push("/home");
            reset();
          }

          if (x?.error) {
            console.error(x.error);
            myToast.error("Something went wrong. Please try again.");
          }
        },
      }),
    );

  const submitFunc = async (data: VerifyFormValues) => {
    mutate(data);
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
          <Stack align={"center"}>
            <Heading color={headingColor} fontSize={"4xl"} textAlign={"center"}>
              {`Thanks for signing up, ${name}!`}
            </Heading>
            <Text fontSize={"xl"}>
              Please assign a password to your new account
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
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

              <FormControlledText
                isRequired
                control={control}
                name="confirmPassword"
                label="Confirm Password"
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

              <Stack spacing={10} pt={2}>
                <Button
                  isDisabled={isLoading || isSubmitting}
                  loadingText="Submitting"
                  size="lg"
                  color={"white"}
                  _dark={{ color: "gray.800" }}
                  _hover={{
                    bg: "brand.600",
                  }}
                  type="submit"
                >
                  Create Account
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Flex>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res });
  if (session?.user) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  const token = ctx.query.link as string | null;
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) {
    return { notFound: true };
  }

  const verify = (await verifyToken(token, secret).catch((err) => {
    console.error("Verify err: " + JSON.stringify(err));
  })) as {
    data: { email: string; displayName: string; linkId: string };
  } | null;

  if (verify && "data" in verify) {
    const verifyLink = await prisma?.accountVerificationLinks.findUnique({
      where: { id: verify.data.linkId },
    });
    if (!verifyLink || verifyLink?.hasBeenUsed) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        data: verify.data,
        token,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};
