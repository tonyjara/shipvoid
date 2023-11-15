import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import Stripe from "stripe";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/server/db";
import { throwInternalServerError } from "@/lib/dictionaries/knownErrors";
import { createId } from "@paralleldrive/cuid2";
import { decimalDivBy100, decimalTimes100 } from "@/lib/utils/DecimalUtils";
import { createServerLog } from "@/server/serverUtils";
import { validateStripeProductCreate } from "@/lib/Validations/StripeProductCreate.validate";
import { validateStripePriceCreate } from "@/lib/Validations/StripePriceCreate.validate";
import { validateStripePriceEdit } from "@/lib/Validations/StripePriceEdit.validate";
import { validatePSStripeProductUpdate } from "@/lib/Validations/StripeProductUpdate.validate";
import { env } from "@/env.mjs";
import { PlatformProduct } from "@prisma/client";

const stripeKey = env.STRIPE_SECRET_KEY;
const webUrl = env.NEXT_PUBLIC_WEB_URL;

if (!stripeKey || !webUrl)
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Stripe key or web url not found",
  });
const stripe = new Stripe(stripeKey, {
  apiVersion: "2023-10-16",
});

export const stripeRouter = createTRPCRouter({
  getProductsAndPrices: publicProcedure.query(async () => {
    const products = await stripe.products.list({
      limit: 100,
      active: true,
    });
    const prices = await stripe.prices.list({ limit: 100, active: true });
    const psProducts = await prisma.product.findMany({
      where: { active: true },
    });
    const psPrices = await prisma.price.findMany({
      where: { active: true },
    });

    return { products, prices, psProducts, psPrices };
  }),

  getPriceAndProductByTag: publicProcedure
    .input(z.object({ platformProductName: z.nativeEnum(PlatformProduct) }))
    .query(async ({ input }) => {
      const product = await prisma.product.findFirst({
        where: { platformProductName: input.platformProductName },
      });
      const price = await prisma.price.findFirst({
        where: { productId: product?.id },
      });
      return { price, product };
    }),

  //** Creates a checkout session and stores priceId and sessionId into a new payments row */
  getSessionUrlAndCreatePaymentIntent: publicProcedure
    .input(
      z.object({
        productId: z.string().min(1),
        defaultPriceId: z.string().min(1),
        platformProductName: z.nativeEnum(PlatformProduct),
      }),
    )
    .mutation(async ({ input }) => {
      const product = await prisma.product.findFirst(); // Prevents signung up if no products exist
      if (!product) {
        await createServerLog("No products found", "ERROR");
        throwInternalServerError("No products found");
      }

      const prices = await stripe.prices.list({
        product: input.productId,
      });

      const line_items = prices.data.map((price) => {
        return {
          price: price.id,
          quantity: price.id === input.defaultPriceId ? 1 : undefined,
        };
      });

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${webUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${webUrl}/pricing`,
      });

      const defaultPrice = prices.data.find(
        (x) => x.id === input.defaultPriceId,
      );

      await prisma.purchaseIntent.create({
        data: {
          amountTotal: decimalDivBy100(
            defaultPrice?.unit_amount_decimal ?? "0",
          ),
          stripeProductId: input.productId,
          stripePriceId: input.defaultPriceId,
          checkoutSessionId: session.id,
          platformProductName: input.platformProductName,

          //NOTE: HACK - this is a hack to get around the fact that we don't have a payment intent id yet
          // paymentIntentId gets updated in the webhook
          // Sadly prisma still does not support nullable uinique fields.
          paymentIntentId: new Date().valueOf().toString(),
        },
      });

      return { url: session.url };
    }),
  createProduct: adminProcedure
    .input(validateStripeProductCreate)
    .mutation(async ({ input }) => {
      const prodId = `ps_prod_${createId()}`;

      const stripeProd = await stripe.products.create({
        id: prodId,
        name: input.prodName,
        description: input.prodDescription,
        metadata: {
          features: input.features,
          sortOrder: input.sortOrder,
          platformProductName: input.platformProductName,
        },
        default_price_data: {
          currency: "usd",
          unit_amount_decimal: decimalTimes100(input.unit_amount_decimal),
        },
      });
      const price = await stripe.prices.update(
        stripeProd.default_price as string,
        {
          nickname: `default price for ${input.prodName}`,
          metadata: {
            platformProductName: input.platformProductName,
            sortOrder: "1",
          },
        },
      );

      if (!stripeProd || !price) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe product creation failed",
        });
      }

      await prisma.product.create({
        data: {
          id: prodId,
          name: input.prodName,
          description: input.prodDescription,
          features: input.features,
          sortOrder: input.sortOrder,
          platformProductName: input.platformProductName,

          prices: {
            create: {
              active: true,
              currency: "usd",
              id: stripeProd.default_price as string,
              nickName: `default price for ${input.prodName}`,
              sortOrder: "1",
              unit_amount_decimal: input.unit_amount_decimal,
            },
          },
        },
      });
    }),
  editProduct: adminProcedure
    .input(validatePSStripeProductUpdate)
    .mutation(async ({ input }) => {
      const product = await stripe.products.update(input.id, {
        name: input.name,
        active: input.active,
        metadata: {
          features: input.features,
          sortOrder: input.sortOrder,
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe product creation failed",
        });
      }
      await prisma.product.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          features: input.features,
          sortOrder: input.sortOrder,
        },
      });
    }),
  editPrice: adminProcedure
    .input(validateStripePriceEdit)
    .mutation(async ({ input }) => {
      const price = await stripe.prices.update(input.id, {
        nickname: input.nickName,
        active: input.active,
        metadata: { sortOrder: input.sortOrder },
      });

      if (!price) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe price edit failed",
        });
      }
      await prisma.price.update({
        where: { id: input.id },
        data: {
          active: input.active,
          nickName: input.nickName,
          sortOrder: input.sortOrder,
        },
      });
    }),
  createPrice: adminProcedure
    .input(validateStripePriceCreate)
    .mutation(async ({ input }) => {
      const price = await stripe.prices.create({
        currency: "usd",
        product: input.productId,
        metadata: { sortOrder: input.sortOrder },
        unit_amount_decimal: decimalTimes100(input.unit_amount_decimal),
        nickname: input.nickName,
      });
      if (!price) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe price creation failed",
        });
      }
      await prisma.price.create({
        data: {
          id: price.id,
          active: true,
          nickName: input.nickName,
          unit_amount_decimal: input.unit_amount_decimal,
          currency: "usd",
          sortOrder: input.sortOrder,
          productId: input.productId,
        },
      });
    }),
  pullStripePricesAndProducts: adminProcedure
    .input(
      z.object({
        productIds: z.string().array(),
      }),
    )
    .mutation(async ({ input }) => {
      const prices = await stripe.prices.list({
        limit: 100,
        active: true,
      });
      const products = await stripe.products.list({
        limit: 100,
        active: true,
      });
      let defaultPriceIds: string[] = [];

      for await (const id of input.productIds) {
        const match = products.data.find((x) => x.id === id);
        const defaultPrice = prices.data.find(
          (x) => x.id === match?.default_price,
        );
        if (!match || !defaultPrice) continue;
        defaultPriceIds.push(defaultPrice.id);

        await prisma.product.create({
          data: {
            id,
            name: match.name,
            description: match.description ?? "",
            features: match.metadata?.features ?? "",
            sortOrder: match.metadata?.sortOrder ?? "",
            platformProductName:
              (defaultPrice.metadata?.tag as PlatformProduct) ?? "TRANSCRIBELY",

            prices: {
              create: {
                id: defaultPrice.id,
                active: true,
                nickName: `default price for ${match.name}`,
                unit_amount_decimal: defaultPrice.unit_amount_decimal ?? "0",
                currency: "usd",
                sortOrder: "1",
              },
            },
          },
        });
      }
    }),
  connectPurchaseIntentToUserId: publicProcedure
    .input(
      z.object({
        purchaseIntentId: z.string().min(1),
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      await prisma.purchaseIntent.update({
        where: { id: input.purchaseIntentId },
        data: { userId: input.userId },
      });
    }),
});
