import { createServerLog } from "@/server/serverUtils";
import { postToTelegramGroup } from "@/utils/TelegramUtils";
import { addMonths } from "date-fns";
import { creditsPerPlan, addSubscriptionCredits } from "./StripeUsageUtils";
import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

/** This function is used after the user row is created, it holds the business logic for creating the user resources. */
export const createNewUserResources = async ({
  userId,
  email,
  name,
  tx,
}: {
  email: string;
  name: string;
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
  userId: string;
}) => {
  const subscription = await tx.subscription.create({
    data: {
      active: true,
      isFreeTrial: true,
      cancellAt: addMonths(new Date(), 1),
      userId: userId,
    },
  });

  await tx.preferences.create({
    data: {
      userId: userId,
    },
  });

  //Add to mailing list
  await tx.mailingList.create({
    data: {
      email: email,
      name: name,
    },
  });

  //Add credits for free plan

  const credits = creditsPerPlan("FREE");
  //ADD CHAT INPUT TOKENS
  const lastInputAction = await tx.subscriptionCreditsActions.findFirst({
    where: {
      subscriptionId: subscription.id,
      tag: "CHAT_INPUT",
    },
    orderBy: { id: "desc" },
  });
  await addSubscriptionCredits({
    tag: "CHAT_INPUT",
    lastAction: lastInputAction,
    amount: credits.chatInput,
    subscriptionId: subscription.id,
    tx,
  });

  //ADD CHAT OUTPUT TOKENS
  const lastOutputAction = await tx.subscriptionCreditsActions.findFirst({
    where: {
      subscriptionId: subscription.id,
      tag: "CHAT_OUTPUT",
    },
    orderBy: { id: "desc" },
  });
  await addSubscriptionCredits({
    tag: "CHAT_OUTPUT",
    lastAction: lastOutputAction,
    amount: credits.chatOutput,
    subscriptionId: subscription.id,
    tx,
  });

  //ADD TRANSCRIPTION MINUTES
  const lastTranscriptionAction = await tx.subscriptionCreditsActions.findFirst(
    {
      where: {
        subscriptionId: subscription.id,
        tag: "TRANSCRIPTION_MINUTE",
      },
      orderBy: { id: "desc" },
    },
  );
  await addSubscriptionCredits({
    tag: "TRANSCRIPTION_MINUTE",
    lastAction: lastTranscriptionAction,
    amount: credits.transcription,
    subscriptionId: subscription.id,
    tx,
  });
  //Notify and log
  await createServerLog(`User ${email} signed up`, "INFO");
  await postToTelegramGroup(email, "SIGNUP");
};
