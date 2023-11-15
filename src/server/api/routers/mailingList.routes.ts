import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { appOptions } from "@/lib/Constants/AppOptions";
import { validateRecaptcha } from "@/server/serverUtils";
import { subMinutes } from "date-fns";
import { sendNewsLetterConfirmationEmail } from "@/server/emailProviders/emailAdapters";
import { TRPCError } from "@trpc/server";
import { makeSignedTokenForNewsletterConfirm } from "./routeUtils/VerificationLinks.routeUtils";
import { validateAddToMailingList } from "@/lib/Validations/AddToMailingList.validate";
import { env } from "@/env.mjs";
import { z } from "zod";

const isDevEnv = process.env.NODE_ENV === "development";

export const mailingListRouter = createTRPCRouter({
  sendConfirmationLink: publicProcedure
    .input(validateAddToMailingList)
    .mutation(async ({ input }) => {
      await validateRecaptcha(input.reCaptchaToken);

      const mailExistsInNewsletter = await prisma.mailingList.findFirst({
        where: { email: input.email },
      });
      if (mailExistsInNewsletter && mailExistsInNewsletter.hasUnsubscribed)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "This email has unsubscribed from newsletter. To re-subscribe change your notificacion settings.",
        });
      if (mailExistsInNewsletter && mailExistsInNewsletter.hasConfirmed)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "This email has is already subscribed to newsletter. To change your notificacion settings go to your profile.",
        });

      if (
        mailExistsInNewsletter?.confirmationSentAt &&
        mailExistsInNewsletter.confirmationSentAt > subMinutes(new Date(), 2)
      )
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Please wait a couple of minutes before retrying.",
        });

      //Create row in mailingList table
      const row = await prisma.mailingList.upsert({
        where: { email: input.email },
        update: {
          name: input.name,
          confirmationSentAt: new Date(),
        },
        create: {
          email: input.email,
          name: input.name,
          confirmationSentAt: new Date(),
        },
      });

      const secret = env.JWT_SECRET;

      const signedToken = makeSignedTokenForNewsletterConfirm({
        email: input.email,
        name: input.name,
        confirmationId: row.confirmationId,
        secret,
      });
      const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;
      const link = `${baseUrl}/newsletter/confirm/${signedToken}`;

      if (!isDevEnv || appOptions.enableEmailApiInDevelopment) {
        await sendNewsLetterConfirmationEmail({
          email: input.email,
          name: input.name,
          link,
        });
      }
      if (isDevEnv && !appOptions.enableEmailApiInDevelopment) {
        console.info("Verification Link: ", link);
      }

      return { status: "successs", sentAt: row.confirmationSentAt };
    }),
  count: adminProcedure.query(async () => {
    return await prisma.mailingList.count();
  }),
  getMany: adminProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
      }),
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma?.mailingList.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: { createdAt: "desc" },
      });
    }),

  deleteById: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return await prisma.mailingList.delete({ where: { id: input.id } });
    }),
});
