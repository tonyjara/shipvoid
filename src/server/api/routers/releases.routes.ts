import { validateRelease } from "@/lib/Validations/Release.validate";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { PlatformProduct } from "@prisma/client";
import { z } from "zod";

export const releasesRouter = createTRPCRouter({
  getManyByTag: adminProcedure
    .input(z.object({ platformProductName: z.nativeEnum(PlatformProduct) }))
    .query(async ({ input }) => {
      return await prisma.downloadableProduct.findMany({
        where: { platformProductName: input.platformProductName },
        orderBy: { id: "desc" },
        take: 10,
      });
    }),
  getManyByTagThatIvePurchased: protectedProcedure
    .input(z.object({ platformProductName: z.nativeEnum(PlatformProduct) }))
    .query(async ({ input, ctx }) => {
      const pruchasesMatchingProductName =
        await prisma.purchaseIntent.findFirst({
          where: {
            userId: ctx.session.user.id,
            platformProductName: input.platformProductName,
            succeeded: true,
          },
        });
      if (!pruchasesMatchingProductName) return [];
      return await prisma.downloadableProduct.findMany({
        where: { platformProductName: input.platformProductName },
        orderBy: { id: "desc" },
        take: 10,
      });
    }),
  getLatestReleaseByTag: protectedProcedure
    .input(z.object({ platformProductName: z.nativeEnum(PlatformProduct) }))
    .query(async ({ input }) => {
      return await prisma.downloadableProduct.findFirst({
        where: { platformProductName: input.platformProductName },
        orderBy: {
          id: "desc",
        },
      });
    }),
  createRelease: adminProcedure
    .input(validateRelease)
    .mutation(async ({ input }) => {
      return await prisma.downloadableProduct.create({
        data: {
          title: input.title,
          content: input.content,
          platformProductName: input.platformProductName,
          containerName: input.containerName,
          blobName: input.blobName,
        },
      });
    }),
  editRelease: adminProcedure
    .input(validateRelease)
    .mutation(async ({ input }) => {
      return await prisma.downloadableProduct.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          platformProductName: input.platformProductName,
          containerName: input.containerName,
          blobName: input.blobName,
        },
      });
    }),

  deleteRelease: adminProcedure
    .input(z.object({ releaseId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.downloadableProduct.delete({
        where: { id: input.releaseId },
      });
    }),
});
