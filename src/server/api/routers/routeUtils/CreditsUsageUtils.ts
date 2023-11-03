import { prisma } from "@/server/db";
import { StripePriceTag, SubscriptionCreditsActions } from "@prisma/client";
import Decimal from "decimal.js";

export type chatEnums = Extract<StripePriceTag, "CHAT_INPUT" | "CHAT_OUTPUT">;

export const saveChatUsageToDb = async ({
  tokens,
  subscriptionId,
  lastChatAction,
  chatType,
}: {
  tokens: Decimal;
  subscriptionId: string;
  lastChatAction: SubscriptionCreditsActions | null;
  chatType: chatEnums;
}) => {
  await prisma.subscriptionCreditsActions.create({
    data: {
      amount: tokens,
      tag: chatType,
      prevAmount: lastChatAction?.currentAmount,
      currentAmount: lastChatAction?.currentAmount.sub(tokens),
      subscriptionId,
    },
  });
};
