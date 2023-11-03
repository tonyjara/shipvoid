import {
  Flex,
  Box,
  FormControl,
  HStack,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import FormControlledText from "@/components/Forms/FormControlled/FormControlledText";
import ReCAPTCHA from "react-google-recaptcha";
import { trpcClient } from "@/utils/api";
import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import { getServerAuthSession } from "@/server/auth";
import { GetServerSideProps } from "next";
import { siteData } from "@/lib/Constants";
import { useRouter } from "next/router";
import {
  AddToMailingListFormValues,
  defaultAddToMailingListValues,
  validateAddToMailingList,
} from "@/lib/Validations/AddToMailingList.validate";

export default function GetNotifiedWhenReady() {
  const recaptchaRef = useRef<any>(null);
  const siteKey = process.env.NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY;
  const router = useRouter();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddToMailingListFormValues>({
    defaultValues: defaultAddToMailingListValues,
    resolver: zodResolver(validateAddToMailingList),
  });

  const { mutate, isLoading } = trpcClient.auth.addToMailingList.useMutation(
    handleUseMutationAlerts({
      successText:
        "You have been added to the list, we'll notify you when the app is ready",
      callback: async () => {
        //Re-route home to avoid re-submission
        reset();
        router.push("/");
      },
    }),
  );

  const submitFunc = async (data: AddToMailingListFormValues) => {
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
              color={headingColor}
              maxW={"500px"}
              fontSize={"4xl"}
              textAlign={"center"}
            >
              Get notified when {siteData.appName} is ready
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={{ base: 4, md: 8 }}
          >
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
                  Notify me
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
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
