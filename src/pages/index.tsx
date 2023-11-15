import Faq from "@/components/Hero/Faq";
import Features from "@/components/Hero/Features";
import Footer from "@/components/Hero/Footer";
import TranscribelyHero from "@/components/Hero/Transcribely/Transcribely.hero";
import { transcribelyFaq } from "@/lib/Constants/SiteData";
import React from "react";
import Stripe from "stripe";

export interface PricingPageProps {
  products: Stripe.ApiList<Stripe.Product>;
  prices: Stripe.ApiList<Stripe.Price>;
}

const Index = () => {
  return (
    <>
      <TranscribelyHero />
      <Features />
      <Faq faq={transcribelyFaq} />
      <Footer />
    </>
  );
};

export default Index;
