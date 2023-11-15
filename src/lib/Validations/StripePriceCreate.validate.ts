import * as z from "zod";

export interface PSStripePriceCreate {
  productId: string;
  unit_amount_decimal: string;
  sortOrder: string;
  nickName: string;
}

export const validateStripePriceCreate: z.ZodType<PSStripePriceCreate> = z.lazy(
  () =>
    z.object({
      productId: z.string().min(1),
      nickName: z.string().min(1),
      sortOrder: z.string().min(1),
      unit_amount_decimal: z.string().min(1),
    }),
);

export const DefaultPSStripePriceCreate: PSStripePriceCreate = {
  productId: "",
  nickName: "",
  sortOrder: "0",
  unit_amount_decimal: "0",
};
