import * as z from "zod";

export interface PurchaseVerifyFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  linkId: string;
  accountId: string;
  agreesToReceiveEmails: boolean;
}

export const validatePurchaseVerify: z.ZodType<PurchaseVerifyFormValues> = z
  .lazy(() =>
    z.object({
      email: z.string().email({ message: "Please enter a valid email" }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
      confirmPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
      name: z.string().min(1, { message: "Name is required" }),
      linkId: z.string().min(1, { message: "Last name is required" }),
      accountId: z.string().min(1, { message: "Account id is required" }),
      agreesToReceiveEmails: z.boolean(),
    }),
  )
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export const defaultPurchaseVerifyValues: PurchaseVerifyFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  linkId: "",
  accountId: "",
  agreesToReceiveEmails: true,
};
