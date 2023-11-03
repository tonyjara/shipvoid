import * as z from "zod";

export interface SignupFormValues {
  email: string;
  name: string;
  reCaptchaToken: string;
  hasAgreedToTerms: boolean;
}

export const validateSignup: z.ZodType<SignupFormValues> = z
  .lazy(() =>
    z.object({
      email: z.string().email({ message: "Please enter a valid email" }),
      name: z.string().min(1, { message: "Name is required" }),
      reCaptchaToken: z.string(),
      hasAgreedToTerms: z.boolean(),
    }),
  )
  .superRefine(({ hasAgreedToTerms }, ctx) => {
    if (!hasAgreedToTerms) {
      ctx.addIssue({
        path: ["hasAgreedToTerms"],
        code: "custom",
        message: "You must agree to the terms and conditions",
      });
    }
  });

export const defaultSignupValues: SignupFormValues = {
  email: "",
  name: "",
  reCaptchaToken: "",
  hasAgreedToTerms: false,
};
