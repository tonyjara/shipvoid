import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "stream/consumers";
import Stripe from "stripe";
import Cors from "micro-cors";
import {
  handleCheckoutSessionCompleted,
  handlePaymentIntentSucceeded,
} from "@/server/stripeWebhookUtils";
import { createServerLog } from "@/server/serverUtils";
import { env } from "@/env.mjs";
const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});
export const config = {
  api: {
    bodyParser: false,
  },
};

const webHookSecret = env.STRIPE_WEBHOOK_SECRET;
const stripeKey = env.STRIPE_SECRET_KEY;

const handleStripeWebhooks = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (!webHookSecret || !stripeKey)
    return res.status(500).json({ message: "Stripe webhook secret not set" });

  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
  });

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"]!;

  let event: Stripe.Event | any;
  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webHookSecret);

    await handleCheckoutSessionCompleted({ e: event });
    await handlePaymentIntentSucceeded({ e: event });

    res.status(200).end();
  } catch (err: any) {
    // On error, log and return the error message
    await createServerLog(
      `Stripe Webhook Error ${err.message}`,
      "ERROR",
      event?.id,
    );
    console.error(`❌ Error message: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
};

export default cors(handleStripeWebhooks as any);
