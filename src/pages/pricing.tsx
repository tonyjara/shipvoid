import MetaTagsComponent from "@/components/Meta/MetaTagsComponent";
import Pricing from "@/pageContainers/Pricing";
import { getServerAuthSession } from "@/server/auth";
import { TRPCError } from "@trpc/server";
import { type GetServerSideProps } from "next";
import React from "react";
import Stripe from "stripe";

export interface PricingPageProps {
  products: Stripe.ApiList<Stripe.Product>;
  prices: Stripe.ApiList<Stripe.Price>;
}

const Index = (props: PricingPageProps) => {
  return (
    <>
      <MetaTagsComponent title="Pricing" />
      <Pricing {...props} />
    </>
  );
};

export default Index;
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { p = "/" } = ctx.query;

  const session = await getServerAuthSession(ctx);

  const destination = () => {
    if (p.toString().length === 1) return "/home";
    return p.toString();
  };

  if (session) {
    return {
      redirect: {
        destination: destination(),
        permanent: false,
      },
      props: {},
    };
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Stripe key not found",
    });
  const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
  });
  const products = await stripe.products.list({ active: true, limit: 100 });
  const prices = await stripe.prices.list({ limit: 100, active: true });

  return {
    props: { products, prices },
  };
};
