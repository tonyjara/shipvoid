import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { sendNewsLetterConfirmationEmail } from "@/server/emailProviders/emailAdapters";
import { verifySMTPConnection } from "@/server/emailProviders/nodemailer";
import { z } from "zod";

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

  countSuccesfulPurchases: adminProcedure.query(async () => {
    return prisma.purchaseIntent.count({
      where: {
        succeeded: true,
      },
    });
  }),
});
