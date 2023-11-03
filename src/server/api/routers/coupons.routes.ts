import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { createServerLog } from "@/server/serverUtils";
import { z } from "zod";
import { addSubscriptionCredits } from "./routeUtils/StripeUsageUtils";
import { TRPCError } from "@trpc/server";

export const couponsRouter = createTRPCRouter({
  countCoupons: protectedProcedure.query(async () => {
    return await prisma.coupons.count({ where: { hasBeenClaimed: false } });
  }),
  claimCoupon: protectedProcedure
    .input(z.object({ couponCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session?.user;
      return await prisma.$transaction(
        async (tx) => {
          const subscription = await tx.subscription.findFirstOrThrow({
            where: { userId: user?.id, active: true },
          });
          const coupon = await tx.coupons.findFirst({
            where: { couponCode: input.couponCode, hasBeenClaimed: false },
          });
          if (!coupon) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Coupon not found or already claimed",
            });
          }

          //INPUT
          const lastInputAction =
            await prisma.subscriptionCreditsActions.findFirst({
              where: { subscriptionId: subscription.id, tag: "CHAT_INPUT" },
              orderBy: { id: "desc" },
            });
          await addSubscriptionCredits({
            tx,
            tag: "CHAT_INPUT",
            lastAction: lastInputAction,
            amount: coupon.chatInputCredits,
            subscriptionId: subscription.id,
          });

          //OUTPUT
          const lastOutputAction =
            await prisma.subscriptionCreditsActions.findFirst({
              where: { subscriptionId: subscription.id, tag: "CHAT_OUTPUT" },
              orderBy: { id: "desc" },
            });
          await addSubscriptionCredits({
            tx,
            tag: "CHAT_OUTPUT",
            lastAction: lastOutputAction,
            amount: coupon.chatOutputCredits,
            subscriptionId: subscription.id,
          });

          //TRANSCRIPTION
          const lastTranscriptionAction =
            await prisma.subscriptionCreditsActions.findFirst({
              where: {
                subscriptionId: subscription.id,
                tag: "TRANSCRIPTION_MINUTE",
              },
              orderBy: { id: "desc" },
            });
          await addSubscriptionCredits({
            tx,
            tag: "TRANSCRIPTION_MINUTE",
            lastAction: lastTranscriptionAction,
            amount: coupon.transcriptionMinutes,
            subscriptionId: subscription.id,
          });

          await createServerLog(`Coupon claimed by ${user.email}`, "INFO");

          return await tx.coupons.update({
            where: { id: coupon.id },
            data: {
              subscriptionId: subscription.id,
              claimedAt: new Date(),
              hasBeenClaimed: true,
            },
          });
        },
        { timeout: 10000 },
      );
    }),
});
