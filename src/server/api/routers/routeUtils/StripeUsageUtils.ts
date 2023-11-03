import { prisma } from "@/server/db";
import {
  PlanType,
  Prisma,
  PrismaClient,
  StripePriceTag,
  SubscriptionCreditsActions,
} from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import Decimal from "decimal.js";
import Stripe from "stripe";

export const registerStripeUsage = async ({
  usage,
  subscriptionItemId,
  stripe,
}: {
  subscriptionItemId: string;
  usage: number;
  stripe: Stripe;
}) => {
  const registerUsage = await stripe.subscriptionItems.createUsageRecord(
    subscriptionItemId,
    {
      quantity: usage,
      timestamp: Math.floor(Date.now() / 1000),
      action: "set",
    },
  );
  return registerUsage;
};

export interface CreditUsageCalculation {
  usageAmount: number;
  currentAmount: Decimal | undefined;
  reportUsageToStripeFunc: (usage: number) => Promise<any>;
  discountFromCreditsFunc: (amountToSubstract: Decimal) => Promise<any>;
}

/** Calculates the amount of credits to substract or to report to stripe, takes the values and functions necessary to execute the logic */
export const handleCreditUsageCalculation = async ({
  usageAmount,
  currentAmount,
  reportUsageToStripeFunc,
  discountFromCreditsFunc,
}: CreditUsageCalculation) => {
  //Might be undefined

  const hanldeCurrentAmount = () => {
    // Prevent negative values from affecting the calculation
    if (!currentAmount) return new Decimal(0);
    return currentAmount?.lessThan(0) ? new Decimal(0) : currentAmount;
  };
  const currentCreditsAmount = hanldeCurrentAmount();
  const usageDecimal = new Decimal(usageAmount);
  const creditsLeftAfterUsageSub = currentCreditsAmount.sub(usageDecimal);

  const response = {
    substractedFromCredits: new Decimal(0),
    reportedToStripe: new Decimal(0),
    left: creditsLeftAfterUsageSub.lessThan(0)
      ? new Decimal(0)
      : creditsLeftAfterUsageSub,
  };

  //credit handling
  if (currentCreditsAmount.greaterThan(0)) {
    if (creditsLeftAfterUsageSub.greaterThanOrEqualTo(0)) {
      await discountFromCreditsFunc(usageDecimal);
      response.substractedFromCredits = usageDecimal;
    }
    if (creditsLeftAfterUsageSub.lessThan(0)) {
      await discountFromCreditsFunc(currentCreditsAmount);
      response.substractedFromCredits = currentCreditsAmount;
    }
  }

  // stripe usage handling
  //If account doesn't have credits, report to stripe full usage
  if (currentCreditsAmount.lessThanOrEqualTo(0)) {
    await reportUsageToStripeFunc(usageAmount);
    response.reportedToStripe = usageDecimal;
  }
  //If current creadits minus usage is less than 0, report to stripe the difference
  if (creditsLeftAfterUsageSub.lessThan(0)) {
    const usageLeft = usageDecimal.sub(currentCreditsAmount);
    await reportUsageToStripeFunc(usageLeft.toNumber());
    response.reportedToStripe = usageLeft;
  }

  return response;
};

export const calculateAudioMinutes = (audioDuration: number) => {
  const decimalDuration = new Decimal(audioDuration);
  const minutes = decimalDuration.div(60).ceil().toNumber();
  return minutes;
};

export const creditsPerPlan = (planType: PlanType) => {
  //This credits get added to all plans once after sign up
  if (planType === "FREE") {
    return {
      chatInput: 50000,
      chatOutput: 50000,
      transcription: 180,
    };
  }
  if (planType === "PAY_AS_YOU_GO") {
    return {
      chatInput: 0,
      chatOutput: 0,
      transcription: 0,
    };
  }

  if (planType === "PRO") {
    return {
      chatInput: 500000,
      chatOutput: 500000,
      transcription: 720,
    };
  }

  return {
    chatInput: 0,
    chatOutput: 0,
    transcription: 0,
  };
};

export const addSubscriptionCredits = async ({
  tag,
  lastAction,
  amount,
  subscriptionId,
  tx,
}: {
  tag: StripePriceTag;
  lastAction: SubscriptionCreditsActions | null;
  amount: number;
  subscriptionId: string;
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
}) => {
  await (tx ? tx : prisma).subscriptionCreditsActions.create({
    data: {
      tag,
      amount: new Decimal(amount),
      prevAmount: lastAction?.currentAmount ?? new Decimal(0),
      currentAmount: lastAction
        ? lastAction?.currentAmount.add(new Decimal(amount))
        : new Decimal(amount),
      subscriptionId,
    },
  });
};
