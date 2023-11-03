import { validateCreateScribe } from "@/components/Forms/CreateScribe.form";
import { validateScribeEdit } from "@/lib/Validations/ScribeEdit.validate";
import { scribePageArgs } from "@/pageContainers/Scribes/Scribes.types";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";

export const scribesRouter = createTRPCRouter({
  count: protectedProcedure.query(async () => {
    return await prisma?.scribe.count();
  }),

  getUnique: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      return await prisma?.scribe.findUnique({
        where: { id: input.id },
        ...scribePageArgs,
      });
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
        whereFilterList: z.any().array().optional(),
      }),
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma?.scribe.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: { createdAt: "desc" },
        ...scribePageArgs,
        where: {
          AND: [...(input?.whereFilterList ?? [])],
        },
      });
    }),
  create: protectedProcedure
    .input(validateCreateScribe)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const subscription = await prisma.subscription.findUniqueOrThrow({
        where: { userId: user?.id },
      });

      return await prisma?.scribe.create({
        data: {
          name: input.scribeName,
          transcription: "",
          userContent: "",
          subscriptionId: subscription.id,
          description: input.scribeDescription,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma?.scribe.delete({ where: { id: input.id } });
    }),
  edit: protectedProcedure
    .input(validateScribeEdit)
    .mutation(async ({ input }) => {
      return await prisma?.scribe.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          transcription: input.transcription,
          userContent: input.userContent,
        },
      });
    }),
});
