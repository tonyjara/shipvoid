import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { TRPCError } from "@trpc/server";

export const accountsRouter = createTRPCRouter({
  toggleActivation: adminProcedure
    .input(z.object({ userId: z.string(), active: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No user session.",
        });
      }
      return await prisma?.user.update({
        where: {
          id: input.userId,
        },
        data: { active: input.active },
      });
    }),
});
