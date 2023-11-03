import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";
import {
  checkIfTrialHasEnoughChatCredits,
  checkIfTrialHasEnoughTranscriptionMinutes,
} from "./routeUtils/freeTrialUtils";
import { postAudioTranscriptionUsageToStripe } from "./routeUtils/PostStripeUsageUtils";
import { handleCreditUsageCalculation } from "./routeUtils/StripeUsageUtils";
import Decimal from "decimal.js";
import { postChatInputAndOutputToStripeAndDb } from "./chatGPT.routes";
import { verifySMTPConnection } from "@/server/emailProviders/nodemailer";
import { validateCoupons } from "@/lib/Validations/CouponCreate.validate";

const isDev = process.env.NODE_ENV === "development";

export const adminRouter = createTRPCRouter({
  /** Simulate chat usage */
  postChatUsage: adminProcedure
    .input(z.object({ inputTokens: z.number(), outputTokens: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { inputTokens, outputTokens } = input;

      const subscription = await prisma.subscription.findUniqueOrThrow({
        where: { userId: ctx.session.user.id },
        include: { subscriptionItems: true },
      });

      const lastChatActions = await checkIfTrialHasEnoughChatCredits({
        tokenCountAverage: inputTokens,
        subscription,
        outputCutoff: 500,
      });
      const { lastChatInputAction, lastChatOuputAction } = lastChatActions;
      await postChatInputAndOutputToStripeAndDb({
        subscription,
        inputTokens,
        outputTokens,
        lastChatInputAction,
        lastChatOuputAction,
      });
    }),

  postTranscriptionMinutesUsage: adminProcedure
    .input(z.object({ durationInMinutes: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { durationInMinutes } = input;

      const subscription = await prisma.subscription.findUniqueOrThrow({
        where: { userId: ctx.session.user.id },
        include: { subscriptionItems: true },
      });

      const lastTranscriptionAction =
        await checkIfTrialHasEnoughTranscriptionMinutes({
          durationInMinutes,
          subscription,
        });

      const postToDb = async (x: Decimal) =>
        await prisma.subscriptionCreditsActions.create({
          data: {
            amount: x,
            tag: "TRANSCRIPTION_MINUTE",
            prevAmount: lastTranscriptionAction?.currentAmount,
            currentAmount: lastTranscriptionAction?.currentAmount.sub(x),
            subscriptionId: subscription.id,
          },
        });

      const postToStripe = async (x: number) =>
        await postAudioTranscriptionUsageToStripe({
          durationInMinutes: x,
          subscription,
        });

      //Hanlde the credits and usage posting
      await handleCreditUsageCalculation({
        usageAmount: durationInMinutes,
        currentAmount: lastTranscriptionAction?.currentAmount,
        reportUsageToStripeFunc: postToStripe,
        discountFromCreditsFunc: postToDb,
      });
    }),
  createCoupon: adminProcedure
    .input(validateCoupons)
    .mutation(async ({ input }) => {
      return await prisma.coupons.create({
        data: {
          chatInputCredits: input.chatInputCredits,
          chatOutputCredits: input.chatOutputCredits,
          transcriptionMinutes: input.transcriptionMinutes,
        },
      });
    }),

  countCoupons: adminProcedure
    .input(
      z.object({
        whereFilterList: z.any().array().optional(),
      }),
    )
    .query(async ({ input }) => {
      return await prisma.coupons.count({
        where: {
          AND: [...(input?.whereFilterList ?? [])],
        },
      });
    }),
  getCoupons: adminProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        whereFilterList: z.any().array().optional(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
      }),
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;
      return await prisma.coupons.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        where: {
          AND: [...(input?.whereFilterList ?? [])],
        },
        include: {
          subscription: {
            select: {
              user: { select: { email: true } },
            },
          },
        },
      });
    }),
  deleteCoupon: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.coupons.delete({ where: { id: input.id } });
    }),
  verifySMTPconnection: adminProcedure.mutation(async () => {
    verifySMTPConnection();
  }),
  deleteStripeSubscription: adminProcedure.mutation(async ({ ctx }) => {
    if (!isDev) throw new Error("Only allowed in dev mode");
    const user = ctx.session.user;

    const subscription = await prisma.subscription.findFirstOrThrow({
      where: { userId: user.id },
    });
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        isFreeTrial: true,
        type: "FREE",
        // add date plus 1 month
        cancellAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    await prisma.subscriptionItem.deleteMany({
      where: { subscriptionId: subscription.id },
    });
  }),
});
