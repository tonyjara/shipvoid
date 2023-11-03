import SuccessPage from "@/pageContainers/Home/Success.page";
import { prisma } from "@/server/db";
import { type GetServerSideProps } from "next";
import Stripe from "stripe";

export default SuccessPage;

// This page retrieves the session from a checkout and redirects to the plans page if the user doesn't have a subscription or whose checkout failed

function returnHome() {
  return {
    redirect: {
      destination: "/home",
      permanent: false,
    },
    props: {},
  };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const session_id = context.query.session_id as string | undefined;

    if (!session_id || !stripeKey) return returnHome();

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    if (!checkoutSession.customer_details) return returnHome();
    if (checkoutSession.payment_status !== "paid") return returnHome();

    const paymentIntent = await prisma.paymentIntent.findUniqueOrThrow({
      where: { id: checkoutSession.id },
    });
    if (paymentIntent.validatedBySuccessPage) return returnHome();

    await prisma.paymentIntent.update({
      where: {
        id: checkoutSession.id,
      },
      data: {
        validatedBySuccessPage: true,
      },
    });
    return {
      props: { customerName: checkoutSession.customer_details.name },
    };
  } catch (error) {
    console.error(error);
  }

  return {
    props: {},
  };
};
