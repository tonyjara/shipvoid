import { env } from "@/env.mjs";
import SuccessPage from "@/pageContainers/Home/Success.page";
import { prisma } from "@/server/db";
import { type GetServerSideProps } from "next";
import Stripe from "stripe";

export default SuccessPage;

function returnHome() {
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
    props: {},
  };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const stripeKey = env.STRIPE_SECRET_KEY;
    const session_id = context.query.session_id as string | undefined;

    if (!session_id || !stripeKey) return returnHome();

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    if (!checkoutSession.customer_details) return returnHome();
    if (checkoutSession.payment_status !== "paid") return returnHome();

    const purchaseIntent = await prisma.purchaseIntent.findUnique({
      where: { checkoutSessionId: checkoutSession.id },
    });
    if (!purchaseIntent) return returnHome();

    if (purchaseIntent?.customerHasSeenSuccessPage) return returnHome();

    await prisma.purchaseIntent.update({
      where: {
        id: purchaseIntent.id,
      },
      data: {
        customerHasSeenSuccessPage: true,
      },
    });
    return {
      props: {
        customerName: checkoutSession.customer_details.name,
        purchaseIntentId: purchaseIntent.id,
      },
    };
  } catch (error) {
    console.error(error);
  }

  return {
    props: {},
  };
};
