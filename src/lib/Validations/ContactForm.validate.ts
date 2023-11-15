import * as z from "zod";

export interface ContactFormType {
  name: string;
  email: string;
  message: string;
  reCaptchaToken: string;
}

export const validateContactForm: z.ZodType<ContactFormType> = z.lazy(() =>
  z.object({
    name: z.string().min(2, "Your name is too short."),
    email: z
      .string({
        required_error: "Please enter your email address",
      })
      .email({ message: "Please enter a valid email address" }),
    message: z.string().min(20, "You message is too short."),
    reCaptchaToken: z
      .string({ invalid_type_error: "Please verify that you are not a robot." })
      .min(1, "Please verify that you are not a robot."),
  }),
);

export const defaultContactFormValues: ContactFormType = {
  name: "",
  email: "",
  message: "",
  reCaptchaToken: "",
};
