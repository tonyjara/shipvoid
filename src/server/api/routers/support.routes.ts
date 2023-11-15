import { validateContactForm } from "@/lib/Validations/ContactForm.validate";
import { validateSupportTicket } from "@/lib/Validations/SupportTicket.validate";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { validateRecaptcha } from "@/server/serverUtils";
import { postToTelegramGroup } from "@/utils/TelegramUtils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const supportRoutes = createTRPCRouter({
  countSupportTickets: protectedProcedure
    .input(
      z.object({
        whereFilterList: z.any().array().optional(),
      }),
    )
    .query(async ({ input }) => {
      return await prisma.supportTicket.count({
        where: {
          AND: [...(input?.whereFilterList ?? [])],
        },
      });
    }),
  submitContactForm: publicProcedure
    .input(validateContactForm)
    .mutation(async ({ input }) => {
      await validateRecaptcha(input.reCaptchaToken);
      await postToTelegramGroup(input.email, input.message);
      await prisma.supportTicket.create({
        data: {
          priority: "unsorted",
          type: "contactForm",
          email: input.email,
          subject: "Contact Form",
          message: input.message,
          status: "open",
        },
      });
    }),

  getSupportTickets: protectedProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        whereFilterList: z.any().array().optional(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
      }),
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      const tickets = await prisma.supportTicket.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: { id: "desc" },
        where: {
          AND: [...(input?.whereFilterList ?? [])],
        },
      });

      return tickets;
    }),
  submitFeedback: protectedProcedure
    .input(validateSupportTicket)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      //First check if the user has send a support ticket in the last 15 minutes
      const lastTicket = await prisma.supportTicket.findFirst({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000),
          },
        },
      });
      if (lastTicket) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You have already sent a support ticket, please wait a few minutes before sending another one.",
        });
      }

      await postToTelegramGroup(
        user?.email ?? user.name ?? user.id,
        `sent a support ticket with the subject: ${input.subject}`,
      );
      return await prisma.supportTicket.create({
        data: {
          userId: user.id,
          email: user.email,
          subject: input.subject,
          message: input.message,
          imageUrl: input.imageUrl,
          imageName: input.imageName,
          type: "unsorted",
          status: "open",
          priority: "unsorted",
        },
      });
    }),
});
