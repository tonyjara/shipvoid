import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
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
});
