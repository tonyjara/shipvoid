import { Coupons } from "@prisma/client";
import * as z from "zod";

export const validateCoupons: z.ZodType<Coupons> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    couponCode: z.string(),
    hasBeenClaimed: z.boolean(),
    claimedAt: z.date().nullable(),
    expirationDate: z.date().nullable(),
    chatInputCredits: z.number(),
    chatOutputCredits: z.number(),
    transcriptionMinutes: z.number(),
    subscriptionId: z.string().nullable(),
  }),
);

export const defaultCouponsValues: Coupons = {
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  couponCode: "",
  hasBeenClaimed: false,
  claimedAt: null,
  expirationDate: null,
  chatInputCredits: 50000,
  chatOutputCredits: 50000,
  transcriptionMinutes: 60,
  subscriptionId: null,
};
