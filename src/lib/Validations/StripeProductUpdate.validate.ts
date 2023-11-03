import { PlanType } from "@prisma/client";
import * as z from "zod";

export interface PSStripeProductUpdate {
  id: string;
  active: boolean;
  name: string;
  description: string;
  features: string;
  payAsYouGo: string;
  sortOrder: string;
  planType: PlanType;
}

export const validatePSStripeProductUpdate: z.ZodType<PSStripeProductUpdate> =
  z.lazy(() =>
    z.object({
      id: z.string().min(1),
      active: z.boolean(),
      name: z.string().min(1),
      description: z.string().min(1),
      features: z.string().min(1),
      payAsYouGo: z.string(),
      sortOrder: z.string().min(1),
      planType: z.nativeEnum(PlanType),
    }),
  );

export const DefaultPSStripeProductUpdateValues: PSStripeProductUpdate = {
  id: "",
  active: true,
  name: "",
  description: "",
  features: "",
  payAsYouGo: "",
  sortOrder: "0",
  planType: "FREE",
};
