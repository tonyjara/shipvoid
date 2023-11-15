import * as z from "zod";

export interface AppStripePriceEdit {
  id: string;
  nickName: string;
  active: boolean;
  sortOrder: string;
}

export const validateStripePriceEdit: z.ZodType<AppStripePriceEdit> = z.lazy(
  () =>
    z.object({
      id: z.string().min(1),
      nickName: z.string().min(1),
      active: z.boolean(),
      sortOrder: z.string(),
    }),
);

export const DefaultPSStripeProductValues: AppStripePriceEdit = {
  id: "",
  nickName: "",
  active: true,
  sortOrder: "0",
};
