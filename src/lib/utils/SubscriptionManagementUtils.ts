import { prisma } from "@/server/db";
import { isAfter } from "date-fns";

/** Check if user has a subscription and if it is active,
if it is not active redirect to re-subscribe page */
export const manageSubscription = async (userId: string | undefined) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (
    subscription?.cancellAt &&
    isAfter(new Date(), subscription?.cancellAt) &&
    subscription?.active
  ) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { active: false },
    });
  }

  if (!subscription) {
    return {
      redirect: {
        destination: "/home/plans",
        permanent: false,
      },
      props: {},
    };
  }

  if (subscription && !subscription.active) {
    return {
      redirect: {
        destination: "/home/re-subscribe",
        permanent: false,
      },
      props: { subscription },
    };
  }
  return null;
};
