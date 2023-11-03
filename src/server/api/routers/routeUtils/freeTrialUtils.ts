import { prisma } from "@/server/db";
import { Subscription } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const checkIfTrialHasEnoughTranscriptionMinutes = async ({
  durationInMinutes,
  subscription,
}: {
  durationInMinutes: number;
  subscription: Subscription;
}) => {
  const lastTranscriptionAction =
    await prisma.subscriptionCreditsActions.findFirst({
      where: {
        subscriptionId: subscription.id,
        tag: "TRANSCRIPTION_MINUTE",
      },
      orderBy: { id: "desc" },
    });

  //Only reject if trial, otherwhise charge user
  if (
    subscription.isFreeTrial &&
    lastTranscriptionAction?.currentAmount.lessThan(durationInMinutes)
  ) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Not enough transcription minutes, please consider upgrading your plan.",
    });
  }

  return lastTranscriptionAction;
};

export const checkIfTrialHasEnoughChatCredits = async ({
  tokenCountAverage,
  subscription,
  outputCutoff,
}: {
  tokenCountAverage: number;
  subscription: Subscription;
  outputCutoff: number;
}) => {
  const lastChatInputAction = await prisma.subscriptionCreditsActions.findFirst(
    {
      where: {
        subscriptionId: subscription.id,
        tag: "CHAT_INPUT",
      },
      orderBy: { id: "desc" },
    },
  );

  const lastChatOuputAction = await prisma.subscriptionCreditsActions.findFirst(
    {
      where: {
        subscriptionId: subscription.id,
        tag: "CHAT_OUTPUT",
      },
      orderBy: { id: "desc" },
    },
  );

  //Only reject if trial, otherwhise charge user
  if (
    subscription.isFreeTrial &&
    (lastChatInputAction?.currentAmount.lessThan(tokenCountAverage) ||
      lastChatOuputAction?.currentAmount.lessThan(outputCutoff))
  ) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Not enough chat credits, please consider upgrading your plan.",
    });
  }

  return { lastChatInputAction, lastChatOuputAction };
};
