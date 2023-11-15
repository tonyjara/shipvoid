import * as z from "zod";

export interface PSStripeProductUpdate {
  id: string;
  active: boolean;
  name: string;
  description: string;
  features: string;
  sortOrder: string;
}

export const validatePSStripeProductUpdate: z.ZodType<PSStripeProductUpdate> =
  z.lazy(() =>
    z.object({
      id: z.string().min(1),
      active: z.boolean(),
      name: z.string().min(1),
      description: z.string().min(1),
      features: z.string().min(1),
      sortOrder: z.string().min(1),
    }),
  );

export const DefaultPSStripeProductUpdateValues: PSStripeProductUpdate = {
  id: "",
  active: true,
  name: "",
  description: "",
  features: "",
  sortOrder: "0",
};
