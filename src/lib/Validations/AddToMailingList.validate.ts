import * as z from "zod";

export interface AddToMailingListFormValues {
  email: string;
  name: string;
  reCaptchaToken: string;
}

export const validateAddToMailingList: z.ZodType<AddToMailingListFormValues> =
  z.lazy(() =>
    z.object({
      email: z.string().email({ message: "Please enter a valid email" }),
      name: z.string().min(1, { message: "Name is required" }),
      reCaptchaToken: z.string(),
    }),
  );

export const defaultAddToMailingListValues: AddToMailingListFormValues = {
  email: "",
  name: "",
  reCaptchaToken: "",
};
