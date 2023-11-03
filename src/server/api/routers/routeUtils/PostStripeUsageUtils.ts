import { Subscription, SubscriptionItem } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { registerStripeUsage } from "./StripeUsageUtils";
import Stripe from "stripe";
import { chatEnums } from "./CreditsUsageUtils";

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

/** Simply posts usage to stripe, does not work if subscription is trial */
export const postAudioTranscriptionUsageToStripe = async ({
  durationInMinutes,
  subscription,
}: {
  durationInMinutes: number;
  subscription: Subscription & {
    subscriptionItems: SubscriptionItem[];
  };
}) => {
  if (subscription.isFreeTrial) return;

  const audioSubscriptionItem = subscription.subscriptionItems.find(
    (item) => item.priceTag === "TRANSCRIPTION_MINUTE",
  );

  if (!audioSubscriptionItem) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Transcription item not found",
    });
  }

  const transactionUsage = await registerStripeUsage({
    usage: durationInMinutes,
    subscriptionItemId: audioSubscriptionItem.id,
    stripe,
  });

  return { transactionUsage };
};

export const postChatUsageToStripe = async ({
  subscription,
  usage,
  chatType,
}: {
  usage: number;
  subscription: Subscription & {
    subscriptionItems: SubscriptionItem[];
  };
  chatType: chatEnums;
}) => {
  if (subscription.isFreeTrial) return;

  const chatInputSubItem = subscription.subscriptionItems.find(
    (item) => item.priceTag === chatType,
  );

  if (!chatInputSubItem) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `${chatType} item not found`,
    });
  }

  await registerStripeUsage({
    usage,
    subscriptionItemId: chatInputSubItem.id,
    stripe,
  });
};
