import { randomAvatar } from "@/lib/Constants/RandomAvatars";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import {
  sendNewsLetterConfirmationEmail,
  sendPurchaseSuccessVerifyEmail,
  sendPurchaseSuccessVerifyEmailWithOneOnOneLink,
} from "@/server/emailProviders/emailAdapters";
import { verifySMTPConnection } from "@/server/emailProviders/nodemailer";
import { createServerLog } from "@/server/serverUtils";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { makeSignedTokenForPurchaseIntent } from "./routeUtils/VerificationLinks.routeUtils";
import { env } from "@/env.mjs";
import { appOptions } from "@/lib/Constants/AppOptions";

const isDevEnv = process.env.NODE_ENV === "development";

export const adminRouter = createTRPCRouter({
  /** Simulate chat usage */

  verifySMTPconnection: adminProcedure.mutation(async () => {
    verifySMTPConnection();
  }),
  sendTestEmail: adminProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      await sendNewsLetterConfirmationEmail({
        email: input.email,
        name: "Test email",
        link: "https://google.com",
      });
    }),
  getManySuccesfulPurchases: adminProcedure.query(async () => {
    return prisma.purchaseIntent.findMany({
      where: {
        succeeded: true,
      },
      take: 100,
    });
  }),
  getManyPurchaseIntents: adminProcedure.query(async () => {
    return prisma.purchaseIntent.findMany({
      take: 100,
    });
  }),

  countSuccesfulPurchases: adminProcedure.query(async () => {
    return prisma.purchaseIntent.count({
      where: {
        succeeded: true,
      },
    });
  }),
  confirmPurchaseManually: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        customerEmail: z.string().email(),
        customerName: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const secret = env.JWT_SECRET;
      const uuid = uuidv4();

      const user = await prisma.user.create({
        data: {
          email: input.customerEmail,
          name: input.customerName,
          emailVerified: new Date(),
          image: randomAvatar(),
          role: "user",
        },
      });

      const account = await prisma.account.create({
        data: {
          userId: user.id,
          providerAccountId: input.customerEmail,
          /* password: hashedPass, */
          provider: "credentials",
          type: "credentials",
        },
      });

      await prisma.purchaseIntent.update({
        where: { id: input.id },
        data: {
          succeeded: true,
          paymentIntentSucceeded: true,
          paymentIntentSucceededAt: new Date(),
          userId: user.id,
        },
      });

      const signedToken = makeSignedTokenForPurchaseIntent({
        email: input.customerEmail,
        name: input.customerName,
        accountId: account.id,
        uuid,
        secret,
      });

      const baseUrl = env.NEXT_PUBLIC_WEB_URL;
      const link = `${baseUrl}/verify-purchase/${signedToken}`;

      await prisma?.accountVerificationLinks.create({
        data: {
          id: uuid,
          verificationLink: link,
          email: input.customerEmail,
        },
      });
      const successfulPurchasesCount = await prisma.purchaseIntent.count({
        where: {
          succeeded: true,
          active: true,
        },
      });

      if (!isDevEnv || appOptions.enableEmailApiInDevelopment) {
        if (successfulPurchasesCount < 50) {
          await sendPurchaseSuccessVerifyEmailWithOneOnOneLink({
            email: input.customerEmail,
            name: input.customerName,
            link,
          });
        } else {
          await sendPurchaseSuccessVerifyEmail({
            email: input.customerEmail,
            name: input.customerName,
            link,
          });
        }
      }

      if (isDevEnv && !appOptions.enableEmailApiInDevelopment) {
        console.info("Purchase verification Link: ", link);
      }

      await createServerLog("Created a new user", "INFO");
    }),
});
