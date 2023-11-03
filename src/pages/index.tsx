import Footer from "@/components/Footer";
import HeroPage from "@/components/Hero";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import React from "react";
import Stripe from "stripe";

export interface PricingPageProps {
  products: Stripe.ApiList<Stripe.Product>;
  prices: Stripe.ApiList<Stripe.Price>;
}

const Index = () => {
  return (
    <>
      <HeroPage />
      <Footer />
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

  return {
    props: {},
  };
};
