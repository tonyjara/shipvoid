import { IconType } from "react-icons";
import { BsStripe } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { GoFileMedia } from "react-icons/go";
import { AiOutlineMail, AiOutlineSafetyCertificate } from "react-icons/ai";
import { PiPiggyBankBold } from "react-icons/pi";
import { SiOpenai } from "react-icons/si";
import { TbColorFilter } from "react-icons/tb";

//Used in footer and meta tags
export const siteData = {
  appName: "Shipvoid",
  logo: "/assets/logo/logo.png",
  mailDomain: "shipvoid.com", // For things as email verification ex: confirmation@mailDomain
  contactEmail: "info@shipvoid.com", // For things as email verification ex: confirmation@mailDomain
  discordLink: "https://discord.gg/skwgV9pdmk",

  //Metadata
  author: "Tony Jara",
  prodUrl: "https://shipvoid.com",
  ogCoverImage: "/assets/meta/og-cover.jpeg",
  description:
    "The most comprehensive starter for your SaaS, Startup, app. Save time and focus on what matters.",
};

export interface Faq {
  question: string;
  answer: string;
}

export const transcribelyFaq: Faq[] = [
  {
    question: "What do I get with my purchase?",
    answer: `After your purchase is finalized you'll receive an email with a link to access your ${siteData.appName} account. You'll be able to download any release of the product and you'll have access to the private discord server.`,
  },
  {
    question: "What is your refund policy?",
    answer:
      "Refunds are not available for this product. If you have any questions about the product, please contact us before making a purchase.",
  },
  {
    question: "Can I use other api's?",
    answer:
      "Absolutely, you can use any api you want. The app is built in a way that you can easily add new api's.",
  },
  {
    question: "Can It handle subscriptions?",
    answer:
      "This app is built with Stripe subscriptions and measured products in mind. You can easily add subscriptions to your app.",
  },
];

export const featuresPageContent = {
  title: "Save time and focus on what matters",
  description:
    "It's not just a template or starter. It's a complete, production ready app built with the purpose of prototyping ideas and products as fast, cheap and reliably as possible. ",
};

export interface Features {
  title: string;
  description: string;
  icon: IconType;
  src?: string;
}

export const transcribelyFeatures: Features[] = [
  {
    title: "Stripe Integration",
    description:
      "We've integrated Stripe to handle payments. You can start accepting payments in minutes.",
    icon: BsStripe,
    src: "/assets/features/stripe.jpeg",
  },
  {
    title: "Unlimited updates",
    description:
      "You'll receive lifetime updates for the product. We'll be adding new features and improvements regularly.",
    icon: RxUpdate,
  },
  {
    title: "Auth",
    description:
      "You can use any auth provider supported by Next Auth, included with this app is Google and Email and password. Password, confirmations and recovery are already taken care off.",
    icon: AiOutlineSafetyCertificate,
    src: "/assets/features/auth.jpeg",
  },
  {
    title: "S3 or Azure",
    description:
      "Use either AWS S3 or Azure storage blob for storage. All the logic for pre-signed url's and all the relevant components already done for you.",
    icon: GoFileMedia,
    src: "/assets/features/s3orazure.jpeg",
  },
  {
    title: "SES or Mailerlite",
    description:
      "Use either AWS SES or Mailerlite for sending emails. All the logic for sending emails is already done for you. Including some basic templates.",
    icon: AiOutlineMail,
    src: "/assets/features/sesormailerlite.jpeg",
  },
  {
    title: "Credits System",
    description:
      "Handle api usage with credits. You can set the price per credit and the amount of credits per request.",
    icon: PiPiggyBankBold,
    src: "/assets/features/credits.jpeg",
  },
  {
    title: "Chat GPT",
    description:
      "Open AI's integration for chat is already done for you. With a chat widget ready to go.",
    icon: SiOpenai,
    src: "/assets/features/chatgpt.jpeg",
  },
  {
    title: "Theming",
    description:
      "Theming system using Chakra UI. You can easily change the colors of the app.",
    icon: TbColorFilter,
    src: "/assets/features/theme.jpeg",
  },
];
