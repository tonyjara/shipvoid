import React, { useRef, useState } from "react";
import {
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Text,
  FormControl,
  FormErrorMessage,
  Flex,
  Link as ChakraLink,
  Box,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import { trpcClient } from "@/utils/api";
import FormControlledText from "@/components/Forms/FormControlled/FormControlledText";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";

export default function ForgotMyPasswordPage() {
  const recaptchaRef = useRef<any>(null);
  const siteKey = process.env.NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY;
  const [disableButton, setDisableButton] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; reCaptchaToken: string }>({
    defaultValues: { email: "", reCaptchaToken: "" },
    resolver: zodResolver(
      z.object({
        email: z.string().email("Enter a valid email address"),
        reCaptchaToken: z.string().min(1),
      }),
    ),
  });

  const { mutate, isLoading } =
    trpcClient.auth.createLinkForPasswordRecovery.useMutation(
      handleUseMutationAlerts({
        successText:
          "An email has been sent to you with a link to reset your password.",
        callback: async () => {
          reset();

          setDisableButton(true);
          setTimeout(() => {
            setDisableButton(false);
          }, 5000);
        },
      }),
    );

  const submitFunc = async (data: {
    email: string;
    reCaptchaToken: string;
  }) => {
    mutate(data);
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
              maxW={"500px"}
              fontSize={{ base: "3xl", md: "4xl" }}
              textAlign={"center"}
              color={headingColor}
            >
              Forgot your password?
            </Heading>
            <Text textAlign={"center"}>
              Enter your email and we'll send you a link to reset your password.
            </Text>
          </Stack>
        </Stack>

        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={{ base: "none", md: "lg" }}
          p={5}
          minW={{ base: "full", md: "lg" }}
          maxW="xl"
        >
          <Stack spacing={8}>
            <FormControlledText
              label={"Email"}
              errors={errors}
              control={control}
              name="email"
              type="email"
              helperText={
                "Please enter your email address to recover your password"
              }
            />

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

            <Button
              isDisabled={isSubmitting || isLoading || disableButton}
              type="submit"
              w={"full"}
              color={"white"}
              _dark={{ color: "gray.800" }}
              _hover={{
                bg: "brand.600",
              }}
            >
              Send email
            </Button>
          </Stack>
          <Box pt="50px">
            <ChakraLink
              color="brand.600"
              alignSelf={"center"}
              as={Link}
              href="/signin"
            >
              Nevermind, remembered password
            </ChakraLink>
          </Box>
        </Box>
      </form>
    </Flex>
  );
}
