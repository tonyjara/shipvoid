import { PlatformProduct } from "@prisma/client";
import * as z from "zod";

export interface PSStripeProductCreate {
  features: string;
  prodDescription: string;
  prodName: string;
  sortOrder: string;
  unit_amount_decimal: string;
  platformProductName: PlatformProduct;
}

export const validateStripeProductCreate: z.ZodType<PSStripeProductCreate> =
  z.lazy(() =>
    z.object({
      features: z.string().min(1),
      prodDescription: z.string().min(1),
      prodName: z.string().min(1),
      sortOrder: z.string().min(1),
      unit_amount_decimal: z.string().min(1),
      platformProductName: z.nativeEnum(PlatformProduct),
    }),
  );

export const defaultPSStripeProductCreate: PSStripeProductCreate = {
  prodName: "",
  prodDescription: "",
  features: "",
  unit_amount_decimal: "0",
  sortOrder: "",
  platformProductName: "TRANSCRIBELY",
};
