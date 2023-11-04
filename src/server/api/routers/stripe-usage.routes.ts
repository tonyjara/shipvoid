import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import Stripe from "stripe";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/server/db";
import Decimal from "decimal.js";

export interface UsageStats {
  tag: string;
  credits: Decimal;
  subscriptionItemId?: string;
}

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Stripe key not found",
  });
}
const stripe = new Stripe(stripeKey, {
  apiVersion: "2023-10-16",
});

export const stripeUsageRouter = createTRPCRouter({});
