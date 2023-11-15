import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import FormControlledText from "@/components/Forms/FormControlled/FormControlledText";
import ReCAPTCHA from "react-google-recaptcha";
import FormControlledCheckbox from "@/components/Forms/FormControlled/FormControlledCheckbox";
import { trpcClient } from "@/utils/api";
import { handleMutationAlerts, myToast } from "@/components/Alerts/MyToast";
import { getServerAuthSession } from "@/server/auth";
import { GetServerSideProps } from "next";
import {
  SignupFormValues,
  defaultSignupValues,
  validateSignup,
} from "@/lib/Validations/Signup.validate";
import { prisma } from "@/server/db";
import { env } from "@/env.mjs";
import { siteData } from "@/lib/Constants/SiteData";

export default function SignupCard() {
  const [sent, setSent] = useState(false);
  const [sentAt, setSentAt] = useState<Date | null>(null);
  const recaptchaRef = useRef<any>(null);
  const siteKey = env.NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY;
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: defaultSignupValues,
    resolver: zodResolver(validateSignup),
  });

  const { mutate, isLoading } =
    trpcClient.auth.generateVerificationLink.useMutation(
      handleMutationAlerts({
        successText: "Verification link sent",
        callback: async (data) => {
          setSent(true);
          setSentAt(data.sentAt);
        },
      }),
    );

  const submitFunc = async (data: SignupFormValues) => {
    mutate(data);
  };

  const handleSendAgain = () => {
    if (!sent || !sentAt) return;
    const now = new Date();
    const diff = now.getTime() - sentAt.getTime();
    if (diff < 5000) {
      myToast.error("Please wait a few seconds before sending again");
      return;
    }

    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    handleSubmit(submitFunc)();
    myToast.success("Verification link sent, please check your email");
  };

  const headingColor = useColorModeValue("brand.500", "brand.400");
  return (
    <Flex
      px="20px"
      minH={"92vh"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <Stack spacing={8} py={{ base: 6, md: 12 }}>
          <Stack spacing={3} align={"center"}>
            <Heading
              color={headingColor}
              maxW={"500px"}
              fontSize={"4xl"}
              textAlign={"center"}
            >
              Create a {siteData.appName} account
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={{ base: 4, md: 8 }}
          >
            {sent && (
              <Stack spacing={6}>
                <Heading size={"md"}>
                  We sent you a signup link, please check your email.
                </Heading>
                <Text alignSelf={"center"}>Did not receive the link?</Text>
                <Button onClick={handleSendAgain}>Send again</Button>
              </Stack>
            )}
            {!sent && (
              <>
                <Stack spacing={4}>
                  <HStack>
                    <FormControlledText
                      isRequired
                      control={control}
                      name="name"
                      label="Name"
                      errors={errors}
                    />
                  </HStack>
                  <FormControlledText
                    isRequired
                    control={control}
                    name="email"
                    label="Email address"
                    errors={errors}
                  />

                  <Flex alignItems={"center"}>
                    <FormControlledCheckbox
                      control={control}
                      name="hasAgreedToTerms"
                      errors={errors}
                      labelComponent={
                        <FormLabel ml={"10px"}>
                          I agree to {siteData.appName}'s{" "}
                          <Link href="/terms-of-service" target={"_blank"}>
                            <Text as={"span"} color={"hyperlink"}>
                              Terms of Service
                            </Text>
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy-policy" target={"_blank"}>
                            <Text as={"span"} color={"hyperlink"}>
                              Privacy Policy
                            </Text>
                          </Link>
                        </FormLabel>
                      }
                    />
                  </Flex>

                  <FormControl isInvalid={!!errors.reCaptchaToken}>
                    {siteKey && (
                      <Controller
                        control={control}
                        name="reCaptchaToken"
                        render={({ field }) => (
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            size="normal"
                            hl="es"
                            sitekey={siteKey}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    )}
                    {errors.reCaptchaToken && (
                      <FormErrorMessage>
                        {errors?.reCaptchaToken?.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
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
                      Sign up with email
                    </Button>
                  </Stack>
                  <Stack pt={6}>
                    <Link href={"/signin"}>
                      <Text as={"span"} color={"brand.600"}>
                        Already a user? Login
                      </Text>
                    </Link>
                  </Stack>
                </Stack>
              </>
            )}
          </Box>
        </Stack>
      </form>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isDevEnv = process.env.NODE_ENV === "development";

  //NOTE: Lock signup if admin user exists in PROD
  const adminUserExists = await prisma.user.findFirst({
    where: { role: "admin" },
  });

  if (!!adminUserExists && !isDevEnv) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }
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
