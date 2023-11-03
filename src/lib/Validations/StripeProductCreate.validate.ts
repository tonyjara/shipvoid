import { PlanType } from "@prisma/client";
import * as z from "zod";

export interface PSStripeProductCreate {
  prodName: string;
  prodDescription: string;
  features: string;
  payAsYouGo: string;
  unit_amount_decimal: string;
  sortOrder: string;
  interval: "day" | "week" | "month" | "year";
  usage_type: "licensed" | "metered";
  planType: PlanType;
}

export const validateStripeProductCreate: z.ZodType<PSStripeProductCreate> =
  z.lazy(() =>
    z.object({
      prodName: z.string().min(1),
      prodDescription: z.string().min(1),
      features: z.string().min(1),
      payAsYouGo: z.string(),
      sortOrder: z.string().min(1),
      unit_amount_decimal: z.string().min(1),
      interval: z.enum(["day", "week", "month", "year"]),
      usage_type: z.enum(["licensed", "metered"]),
      planType: z.nativeEnum(PlanType),
    }),
  );

export const defaultPSStripeProductCreate: PSStripeProductCreate = {
  prodName: "",
  prodDescription: "",
  features: "",
  payAsYouGo: "",
  unit_amount_decimal: "0",
  sortOrder: "",
  interval: "month",
  usage_type: "metered",
  planType: "FREE",
};
