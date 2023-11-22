import { handleMutationAlerts } from "@/components/Alerts/MyToast";
import PageContainer from "@/components/Containers/PageContainer";
import FormControlledText from "@/components/Forms/FormControlled/FormControlledText";
import Footer from "@/components/Hero/Footer";
import MetaTagsComponent from "@/components/Meta/MetaTagsComponent";
import { env } from "@/env.mjs";
import { siteData } from "@/lib/Constants/SiteData";
import {
  ContactFormType,
  defaultContactFormValues,
  validateContactForm,
} from "@/lib/Validations/ContactForm.validate";
import { trpcClient } from "@/utils/api";
import {
  Button,
  Flex,
  Text,
  FormControl,
  Heading,
  FormErrorMessage,
  Divider,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, useForm } from "react-hook-form";
import { BsPerson } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";

export default function ContactPage() {
  const router = useRouter();
  const trpcContext = trpcClient.useUtils();
  const recaptchaRef = useRef<any>(null);
  const siteKey = env.NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormType>({
    defaultValues: defaultContactFormValues,
    resolver: zodResolver(validateContactForm),
  });
  const { mutate: submitContactForm, isLoading } =
    trpcClient.support.submitContactForm.useMutation(
      handleMutationAlerts({
        successText:
          "Thank you for reaching out. Our team will get in touch shortly.",
        callback: () => {
          trpcContext.invalidate();
          reset(defaultContactFormValues);
          router.push("/");
        },
      }),
    );
  const submitFunc = (data: ContactFormType) => {
    submitContactForm(data);
  };
  return (
    <>
      <MetaTagsComponent
        title="Contact Us"
        description={`Get in touch with ${siteData.appName}`}
      />
      <PageContainer className="mb-20 flex flex-col items-center">
        <Heading fontSize={"5xl"} pt={"20px"}>
          Contact us
        </Heading>
        <Text color={"gray.500"}>We'll reach out as soon as possible.</Text>
        <Divider className="my-4 max-w-md " />
        <form
          className="flex w-full max-w-md flex-row justify-center"
          onSubmit={handleSubmit(submitFunc)}
          noValidate
        >
          <Flex gap="20px" flexDir={"column"} w="full">
            <FormControlledText
              control={control}
              errors={errors}
              name="name"
              label="Name"
              placeholder="Your Name"
              isRequired
              inputLeft={<BsPerson />}
            />
            <FormControlledText
              control={control}
              errors={errors}
              name="email"
              label="Email"
              placeholder="Your Email"
              isRequired
              inputLeft={<MdOutlineEmail />}
            />

            <FormControlledText
              control={control}
              errors={errors}
              name="message"
              label="Message"
              isTextArea
              placeholder="Your Message"
              isRequired
              rows={6}
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
                      hl="en"
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
              isDisabled={isSubmitting || isLoading}
              isLoading={isSubmitting || isLoading}
              width="full"
              type="submit"
            >
              Send Message
            </Button>
          </Flex>
        </form>
      </PageContainer>
      <Footer />
    </>
  );
}
