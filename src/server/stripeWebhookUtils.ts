/// <reference types="stripe-event-types" />
import Stripe from "stripe";
import { prisma } from "./db";
import { createServerLog } from "./serverUtils";
import { v4 as uuidv4 } from "uuid";
import { makeSignedTokenForPurchaseIntent } from "./api/routers/routeUtils/VerificationLinks.routeUtils";
import {
  sendPurchaseSuccessVerifyEmail,
  sendPurchaseSuccessVerifyEmailWithOneOnOneLink,
} from "./emailProviders/emailAdapters";
import { appOptions } from "@/lib/Constants/AppOptions";
import { env } from "@/env.mjs";
import { randomAvatar } from "@/lib/Constants/RandomAvatars";

const isDevEnv = process.env.NODE_ENV === "development";

export const handleCheckoutSessionCompleted = async ({
  e,
}: {
  e: Stripe.DiscriminatedEvent;
}) => {
  if (e.type === "checkout.session.completed") {
    await createServerLog("checkout.session.completed started", "INFO");

    const eventObject = e.data.object;

    if (!eventObject?.customer_details?.email) {
      await createServerLog(
        "Checkout session completed, but no email",
        "INFO",
        eventObject.id,
      );
      return;
    }
    if (!eventObject?.payment_intent) {
      await createServerLog(
        "Checkout session completed, session has no payment intent",
        "INFO",
        eventObject.id,
      );
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: eventObject.customer_details.email },
    });

    //Create purchase, this also gives us the user id
    await prisma.purchaseIntent.update({
      where: { checkoutSessionId: eventObject.id }, //session id
      data: {
        customerName: eventObject.customer_details.name,
        customerEmail: eventObject.customer_details.email,
        customerCountry: eventObject.customer_details.address?.country ?? null,
        checkoutSessionCompletedAt: new Date(),
        userId: existingUser?.id ?? null,
        paymentIntentId: eventObject.payment_intent as string,
      },
    });

    await createServerLog("Checkout session completed", "INFO", eventObject.id);
  }
};

// This is the event that is triggered when a product is payed
// Whever the payment is received, we'll create a magic link with and create the user with the product
export const handlePaymentIntentSucceeded = async ({
  e,
}: {
  e: Stripe.DiscriminatedEvent;
}) => {
  if (e.type === "payment_intent.succeeded") {
    await createServerLog("payment_intent.succeeded started", "INFO");

    const eventObject = e.data.object;

    const getPurchaseIntentWithCustomerEmail = async () =>
      await prisma.purchaseIntent.findFirst({
        where: {
          paymentIntentId: eventObject.id,
          customerEmail: { not: null },
          customerName: { not: null },
        },
      });

    const event = e.data.object;

    let existingPurchaseIntentWithCustomerEmail = null;

    const MAX_RETRIES = 5;
    let retries = 1;

    do {
      try {
        existingPurchaseIntentWithCustomerEmail =
          await getPurchaseIntentWithCustomerEmail();
      } catch (error) {
        //wait 1 second before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.info("Retrying to get purchase intent", retries);
        await createServerLog(
          "Retrying to get purchase intent",
          "ERROR",
          event.id,
        );
        retries++;
      }
    } while (
      !existingPurchaseIntentWithCustomerEmail &&
      retries <= MAX_RETRIES
    );

    if (!existingPurchaseIntentWithCustomerEmail) {
      await createServerLog(
        "Payment intent succeeded, but no purchase intent with customer email found, max retries reached",
        "ERROR",
        event.id,
      );
      return;
    }

    const purchaseIntent = existingPurchaseIntentWithCustomerEmail;

    if (purchaseIntent.userId) {
      //NOTE: User already exists, just update the purchase intent

      await prisma.purchaseIntent.update({
        where: { id: purchaseIntent.id },
        data: {
          succeeded: true,
          paymentIntentSucceeded: true,
          paymentIntentSucceededAt: new Date(),
        },
      });

      await createServerLog("Existing user, updated purchase intent", "INFO");
    }

    if (
      !existingPurchaseIntentWithCustomerEmail.userId &&
      purchaseIntent.customerEmail &&
      purchaseIntent.customerName
    ) {
      //NOTE: If customer doesn't exist Create user and verification link

      const secret = env.JWT_SECRET;
      const uuid = uuidv4();

      const user = await prisma.user.create({
        data: {
          email: purchaseIntent.customerEmail,
          name: purchaseIntent.customerName,
          emailVerified: new Date(),
          image: randomAvatar(),
          role: "user",
        },
      });

      const account = await prisma.account.create({
        data: {
          userId: user.id,
          providerAccountId: purchaseIntent.customerEmail,
          /* password: hashedPass, */
          provider: "credentials",
          type: "credentials",
        },
      });

      await prisma.purchaseIntent.update({
        where: { id: purchaseIntent.id },
        data: {
          succeeded: true,
          paymentIntentSucceeded: true,
          paymentIntentSucceededAt: new Date(),
          userId: user.id,
        },
      });

      const signedToken = makeSignedTokenForPurchaseIntent({
        email: purchaseIntent.customerEmail,
        name: purchaseIntent.customerName,
        accountId: account.id,
        uuid,
        secret,
      });

      const baseUrl = env.NEXT_PUBLIC_WEB_URL;
      const link = `${baseUrl}/verify-purchase/${signedToken}`;

      await prisma?.accountVerificationLinks.create({
        data: {
          id: uuid,
          verificationLink: link,
          email: purchaseIntent.customerEmail,
        },
      });

      /* const successfulPurchasesCount = await prisma.purchaseIntent.count({ */
      /*   where: { */
      /*     succeeded: true, */
      /*     active: true, */
      /*   }, */
      /* }); */

      if (!isDevEnv || appOptions.enableEmailApiInDevelopment) {
        /* if (successfulPurchasesCount < 50) { */
        /*   await sendPurchaseSuccessVerifyEmailWithOneOnOneLink({ */
        /*     email: purchaseIntent.customerEmail, */
        /*     name: purchaseIntent.customerName, */
        /*     link, */
        /*   }); */
        /* } else { */
        await sendPurchaseSuccessVerifyEmail({
          email: purchaseIntent.customerEmail,
          name: purchaseIntent.customerName,
          link,
        });
        /* } */
      }

      if (isDevEnv && !appOptions.enableEmailApiInDevelopment) {
        console.info("Purchase verification Link: ", link);
      }

      await createServerLog("Created a new user", "INFO");
    }

    await createServerLog("payment_intent.succeeded finished", "INFO");
  }
};
