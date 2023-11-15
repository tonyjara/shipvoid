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
import { handleMutationAlerts, myToast } from "@/components/Alerts/MyToast";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { verifyToken } from "@/lib/utils/asyncJWT";
import { prisma } from "@/server/db";
import {
  PurchaseVerifyFormValues,
  validatePurchaseVerify,
} from "@/lib/Validations/PurchaseVerify.validate";
import { env } from "@/env.mjs";
import FormControlledCheckbox from "@/components/Forms/FormControlled/FormControlledCheckbox";

interface SignupProps {
  email: string;
  name: string;
  linkId: string;
  accountId: string;
}

//WARNING: THIS COMPONENT IS ONLY USED WHEN A FIRST TIME CUSTOMER MAKES A PURCHASE
//WARNING: NOT WHEN CREATING AN ACCOUNT WITH A VERIFICATION LINK
export default function AddPasswordToExistingAccount(props: {
  data: SignupProps;
}) {
  const {
    data: { email, name, linkId, accountId },
  } = props;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseVerifyFormValues>({
    defaultValues: {
      email,
      name,
      password: "",
      confirmPassword: "",
      linkId,
      accountId,
      agreesToReceiveEmails: true,
    },
    resolver: zodResolver(validatePurchaseVerify),
  });

  const { mutate, isLoading } =
    trpcClient.auth.addUserPasswordAfterPurchase.useMutation(
      handleMutationAlerts({
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
            router.push("/");
            reset();
          }

          if (x?.error) {
            console.error(x.error);
            myToast.error("Something went wrong. Please try again.");
          }
        },
      }),
    );

  const submitFunc = async (data: PurchaseVerifyFormValues) => {
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
              {`Hi ${name}, this is the last step!`}
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
              <FormControlledCheckbox
                control={control}
                name="agreesToReceiveEmails"
                label="I agree to receive notifications about updates and releases."
                errors={errors}
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
                  Assign password
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
        destination: "/",
        permanent: false,
      },
    };
  }

  const token = ctx.query.link as string | null;
  const secret = env.JWT_SECRET;
  if (!secret || !token) {
    return { notFound: true };
  }

  const verify = (await verifyToken(token, secret).catch((err) => {
    console.error("Verify err: " + JSON.stringify(err));
  })) as {
    data: SignupProps;
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
