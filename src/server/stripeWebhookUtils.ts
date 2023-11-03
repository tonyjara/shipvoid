/// <reference types="stripe-event-types" />
import Stripe from "stripe";
import { prisma } from "./db";
import { StripePriceTag } from "@prisma/client";
import { fromUnixTime, isAfter } from "date-fns";
import {
  addSubscriptionCredits,
  creditsPerPlan,
} from "./api/routers/routeUtils/StripeUsageUtils";
import { createServerLog } from "./serverUtils";

export const handleCheckoutSessionCompleted = async ({
  stripe,
  event,
}: {
  stripe: Stripe;
  event: Stripe.DiscriminatedEvent;
}) => {
  if (event.type === "checkout.session.completed") {
    await createServerLog("checkout.session.completed started", "INFO");

    const eventObject = event.data.object;
    if (!eventObject.subscription || !eventObject.customer) {
      await createServerLog(
        "Checkout session completed, but no subscription or customer found",
        "ERROR",
        event.data.object.id,
      );
      return;
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
      eventObject.subscription.toString(),
    );

    // stripeSubscription is a subscription based on a product
    // When getting the object from subscription we also get the subscription items

    const subscriptionItems = stripeSubscription.items.data;
    const prodId = subscriptionItems[0]?.price.product as string;
    const product = await prisma.product.findUnique({
      where: { id: prodId },
    });
    if (!product) {
      await createServerLog(
        "Checkout session completed, but no product found",
        "ERROR",
        event.data.object.id,
      );
      return;
    }

    //Update payment intent, this also gives us the user id
    const paymentIntent = await prisma.paymentIntent.update({
      where: { id: eventObject.id }, //session id
      data: {
        confirmedByWebhookAt: new Date(),
        validatedByWebhook: true,
        confirmationEventId: event.data.object.id,
      },
    });

    if (!paymentIntent.userId) {
      await createServerLog(
        "Checkout session completed, but no user found on payment intent",
        "ERROR",
        event.data.object.id,
      );
      return;
    }

    //User already has a subscription, update the subscription with stripe data
    const existingSubscription = await prisma.subscription.update({
      where: { userId: paymentIntent.userId },
      data: {
        active: true,
        stripeSubscriptionId: eventObject.subscription.toString(),
        stripeCustomerId: eventObject.customer.toString(),
        productId: product.id,
        isFreeTrial: false,
        type: product.planType,
        cancellAt: null,
      },
    });

    const prices = await stripe.prices.list({
      limit: 100,
      active: true,
      product: product.id,
    });

    //Create subscription items
    for await (const item of subscriptionItems) {
      const price = prices.data.find((x) => x.id === item.price.id);
      await prisma.subscriptionItem.create({
        data: {
          id: item.id,
          active: true,
          subscriptionId: existingSubscription.id,
          stripeSubscriptionId: existingSubscription.stripeSubscriptionId,
          priceId: item.price.id,
          priceTag:
            (price?.metadata.tag as StripePriceTag | undefined) ?? "PLAN_FEE",
        },
      });
    }

    await createServerLog(
      "Checkout session completed, subscription updated",
      "INFO",
      event.data.object.id,
    );
  }
};

/** This function manages subscription cancellation */
export const handleSubscriptionUpdated = async ({
  event,
}: {
  event: Stripe.DiscriminatedEvent;
}) => {
  if (event.type === "customer.subscription.updated") {
    await createServerLog(
      "customer.subscription.updated started",
      "INFO",
      event.data.object.id,
    );
    const subscriptionEvent = event.data.object;

    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscriptionEvent.id },
    });

    if (!subscription) {
      await createServerLog(
        "Subscription updated triggered, but no subscription found",
        "ERROR",
        event.data.object.id,
      );
      return;
    }
    const handleActiveState = () => {
      // When a subscription is canceled cancel_at is not null.
      // When a subscription is reactivated cancel_at is null.
      // In that case activate if the subbscription was inactive
      if (!subscriptionEvent.cancel_at && !subscription.active) {
        return true;
      }

      //If its past the cancelation date and the subscription is active, cancel it
      if (
        subscriptionEvent.cancel_at &&
        isAfter(new Date(), subscriptionEvent.cancel_at) &&
        subscription.active
      ) {
        return false;
      }

      return subscription.active;
    };
    await createServerLog(
      `Subscription active state: ${handleActiveState()}`,
      "INFO",
      event.data.object.id,
    );

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        active: handleActiveState(),
        cancellAt: subscriptionEvent.cancel_at
          ? fromUnixTime(subscriptionEvent.cancel_at ?? 0)
          : null,

        cancelledAt: subscriptionEvent.canceled_at
          ? fromUnixTime(subscriptionEvent.canceled_at ?? 0)
          : null,
        eventCancellationId: subscriptionEvent.cancel_at
          ? event.data.object.id
          : null,
      },
    });
    await createServerLog(
      "Subscription updated successfully",
      "INFO",
      event.data.object.id,
    );
  }
};

// This is the event that is triggered when an invoice is paid
// In the case of a subscription, this event is triggered when the subscription is created
// and when the subscription is renewed
export const handleInvoicePaid = async ({
  e,
}: {
  e: Stripe.DiscriminatedEvent;
}) => {
  if (e.type === "invoice.paid") {
    await createServerLog("invoice.paid started", "INFO", e.data.object.id);
    const event = e.data.object;

    //If subscription is active add credits

    if (!event.subscription) {
      await createServerLog(
        "Invoice paid, but no stripe subscription id was found",
        "ERROR",
        event.id,
      );
      return;
    }

    let existingSubscription = null;
    const getExistingSubscription = async () =>
      await prisma.subscription.findFirstOrThrow({
        where: { stripeSubscriptionId: event?.subscription?.toString() },
        include: { product: true },
      });

    // Checkout session finishes after this event
    // we need to wait for the STRIPE subscription to be created so we can get the subscription id

    const MAX_RETRIES = 5;
    let retries = 1;

    do {
      try {
        existingSubscription = await getExistingSubscription();
      } catch (error) {
        //wait 1 second before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.info("Retrying to get subscription", retries);
        await createServerLog(
          "Retrying to get subscription",
          "ERROR",
          event.id,
        );
        retries++;
      }
    } while (!existingSubscription && retries <= MAX_RETRIES);

    if (!existingSubscription) {
      await createServerLog(
        "Invoice paid, but no APP subscription was found, max retries reached",
        "ERROR",
        event.id,
      );
      return;
    }

    if (!existingSubscription.product) {
      await createServerLog(
        "Invoice paid, but no product was found on subscription",
        "ERROR",
        event.id,
      );
      return;
    }

    if (existingSubscription.product.planType === "FREE") {
      await createServerLog(
        "Invoice paid, but subscription is free",
        "INFO",
        event.id,
      );
      //If subscription is free, do nothing
      return;
    }

    const credits = creditsPerPlan(existingSubscription.product.planType);

    //INPUT
    const lastInputAction = await prisma.subscriptionCreditsActions.findFirst({
      where: { subscriptionId: existingSubscription.id, tag: "CHAT_INPUT" },
      orderBy: { id: "desc" },
    });
    await addSubscriptionCredits({
      tag: "CHAT_INPUT",
      lastAction: lastInputAction,
      amount: credits.chatInput,
      subscriptionId: existingSubscription.id,
    });

    //OUTPUT
    const lastOutputAction = await prisma.subscriptionCreditsActions.findFirst({
      where: { subscriptionId: existingSubscription.id, tag: "CHAT_OUTPUT" },
      orderBy: { id: "desc" },
    });
    await addSubscriptionCredits({
      tag: "CHAT_OUTPUT",
      lastAction: lastOutputAction,
      amount: credits.chatOutput,
      subscriptionId: existingSubscription.id,
    });

    //TRANSCRIPTION
    const lastTranscriptionAction =
      await prisma.subscriptionCreditsActions.findFirst({
        where: {
          subscriptionId: existingSubscription.id,
          tag: "TRANSCRIPTION_MINUTE",
        },
        orderBy: { id: "desc" },
      });
    await addSubscriptionCredits({
      tag: "TRANSCRIPTION_MINUTE",
      lastAction: lastTranscriptionAction,
      amount: credits.transcription,
      subscriptionId: existingSubscription.id,
    });

    await createServerLog("Invoice paid, credits added", "INFO", event.id);
  }
};
