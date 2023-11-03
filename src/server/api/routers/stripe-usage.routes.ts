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

export const stripeUsageRouter = createTRPCRouter({
  getMySubscription: adminProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.user;

    const subscription = await prisma.subscription.findUniqueOrThrow({
      where: { userId: user.id },
    });
    if (!subscription?.stripeSubscriptionId)
      throw "No stripe subscription id found";
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription?.stripeSubscriptionId,
    );
    return { subscription, stripeSubscription };
  }),
  getUpcomingInvoice: adminProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const subscription = await prisma.subscription.findUniqueOrThrow({
      where: { userId: user.id },
    });
    if (!subscription?.stripeCustomerId) throw "No stripe customer id found";
    return await stripe.invoices.retrieveUpcoming({
      customer: subscription.stripeCustomerId,
    });
  }),
  getMyUsageForCurrentBillingCycle: protectedProcedure.query(
    async ({ ctx }) => {
      const user = ctx.session.user;

      const subscription = await prisma.subscription.findUniqueOrThrow({
        where: { userId: user.id },
        include: {
          subscriptionItems: true,
          product: { select: { prices: true } },
        },
      });

      //Last Actions
      const lastChatInputAction =
        await prisma.subscriptionCreditsActions.findFirst({
          where: { subscriptionId: subscription.id, tag: "CHAT_INPUT" },
          orderBy: { id: "desc" },
        });

      const lastChatOutputAction =
        await prisma.subscriptionCreditsActions.findFirst({
          where: {
            subscriptionId: subscription.id,
            tag: "CHAT_OUTPUT",
          },
          orderBy: { id: "desc" },
        });

      const lastTranscriptionAction =
        await prisma.subscriptionCreditsActions.findFirst({
          where: {
            subscriptionId: subscription.id,
            tag: "TRANSCRIPTION_MINUTE",
          },
          orderBy: { id: "desc" },
        });

      //Summarize usage and get subscription item ids to be able to extract data from invoice
      let summaries: UsageStats[] = [
        {
          tag: "CHAT_INPUT",
          credits: lastChatInputAction?.currentAmount
            ? lastChatInputAction.currentAmount
            : new Decimal(0),
          subscriptionItemId: subscription.subscriptionItems.find(
            (subItem) => subItem.priceTag === "CHAT_INPUT",
          )?.id,
        },

        {
          tag: "CHAT_OUTPUT",
          credits: lastChatOutputAction?.currentAmount
            ? lastChatOutputAction.currentAmount
            : new Decimal(0),
          subscriptionItemId: subscription.subscriptionItems.find(
            (subItem) => subItem.priceTag === "CHAT_OUTPUT",
          )?.id,
        },

        {
          tag: "TRANSCRIPTION_MINUTE",
          credits: lastTranscriptionAction?.currentAmount
            ? lastTranscriptionAction.currentAmount
            : new Decimal(0),
          subscriptionItemId: subscription.subscriptionItems.find(
            (subItem) => subItem.priceTag === "TRANSCRIPTION_MINUTE",
          )?.id,
        },
      ];
      return summaries;
    },
  ),

  addChatCredits: protectedProcedure
    .input(z.object({ inputTokens: z.number(), outputTokens: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const PSSubscription = await prisma.subscription.findUniqueOrThrow({
        where: { userId: user.id },
      });

      const lastInputAction = await prisma.subscriptionCreditsActions.findFirst(
        {
          where: {
            subscriptionId: PSSubscription.id,
            tag: "CHAT_INPUT",
          },
          orderBy: { id: "desc" },
        },
      );
      await prisma.subscriptionCreditsActions.create({
        data: {
          tag: "CHAT_INPUT",
          amount: new Decimal(input.inputTokens),
          prevAmount: lastInputAction?.currentAmount ?? new Decimal(0),
          currentAmount: lastInputAction
            ? lastInputAction?.currentAmount.add(new Decimal(input.inputTokens))
            : new Decimal(input.inputTokens),
          subscriptionId: PSSubscription.id,
        },
      });

      const lastOutputAction =
        await prisma.subscriptionCreditsActions.findFirst({
          where: {
            subscriptionId: PSSubscription.id,
            tag: "CHAT_OUTPUT",
          },
          orderBy: { id: "desc" },
        });
      await prisma.subscriptionCreditsActions.create({
        data: {
          tag: "CHAT_OUTPUT",
          amount: new Decimal(input.outputTokens),
          prevAmount: lastOutputAction?.currentAmount ?? new Decimal(0),
          currentAmount: lastOutputAction
            ? lastOutputAction?.currentAmount.add(
                new Decimal(input.outputTokens),
              )
            : new Decimal(input.outputTokens),
          subscriptionId: PSSubscription.id,
        },
      });
    }),
});
