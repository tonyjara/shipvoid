import { StripePriceTag } from "@prisma/client";
import * as z from "zod";

export interface PSStripePriceCreate {
  productId: string;
  unit_amount_decimal: string;
  sortOrder: string;
  nickName: string;
  interval: "day" | "week" | "month" | "year";
  usage_type: "licensed" | "metered";
  tag: StripePriceTag;
}

export const validateStripePriceCreate: z.ZodType<PSStripePriceCreate> = z.lazy(
  () =>
    z.object({
      productId: z.string().min(1),
      nickName: z.string().min(1),
      sortOrder: z.string().min(1),
      unit_amount_decimal: z.string().min(1),
      interval: z.enum(["day", "week", "month", "year"]),
      usage_type: z.enum(["licensed", "metered"]),
      tag: z.nativeEnum(StripePriceTag),
    }),
);

export const DefaultPSStripePriceCreate: PSStripePriceCreate = {
  productId: "",
  nickName: "",
  sortOrder: "0",
  unit_amount_decimal: "0",
  interval: "month",
  usage_type: "metered",
  tag: "CHAT_INPUT",
};
