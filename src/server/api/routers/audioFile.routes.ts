import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { deleteAzureBlob } from "@/lib/utils/azure-delete-blob";
import slugify from "slugify";
import { appOptions } from "@/lib/Constants";
import { validateAudioFile } from "@/lib/Validations/Validate.AudioFile";
import { deleteS3Object } from "@/server/aws/s3Utils";

export const audioFileRouter = createTRPCRouter({
  createAudioFileForScribe: protectedProcedure
    .input(validateAudioFile)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const subscription = await prisma.subscription.findUniqueOrThrow({
        where: { userId: user.id, active: true },
      });

      const audioFile = await prisma.audioFile.create({
        data: {
          name: input.name,
          blobName: input.blobName,
          url: input.url,
          scribeId: input.scribeId,
          subscriptionId: subscription.id,
          length: input.length,
          duration: input.duration,
          type: input.type,
          peaks: input.peaks,
          cloudProvider: appOptions.cloudStorageProvider,
        },
      });
      return audioFile;
    }),
  checkIfNameIsUniqueForScribe: protectedProcedure
    .input(z.object({ name: z.string().min(3), scribeId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const subscription = await prisma.subscription.findUniqueOrThrow({
        where: { userId: user.id, active: true },
      });

      const audioFile = await prisma.audioFile.findFirst({
        where: {
          blobName: `${input.scribeId}-${slugify(input.name, {
            lower: true,
          })}-audio-file`,
          scribeId: input.scribeId,
          subscriptionId: subscription.id,
        },
      });

      return { isUnique: audioFile ? false : true };
    }),

  deletePeaks: adminProcedure
    .input(
      z.object({
        id: z.string().min(3),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.audioFile.update({
        where: { id: input.id },
        data: { peaks: [] },
      });
    }),
  deleteAudioFile: protectedProcedure
    .input(
      z.object({
        id: z.string().min(3),
        blobName: z.string().min(3),
        connectionString: z.string().min(3),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const user = ctx.session.user;

        if (appOptions.cloudStorageProvider === "azure") {
          await deleteAzureBlob({
            containerName: user.id,
            blobName: input.blobName,
            connectionString: input.connectionString,
          });
        }
        if (appOptions.cloudStorageProvider === "aws") {
          await deleteS3Object({
            key: input.blobName,
          });
        }

        return await prisma.audioFile.delete({
          where: { id: input.id },
        });
      } catch (err) {
        console.error(err);
      }
    }),
  getScribeAudioFiles: protectedProcedure
    .input(z.object({ scribeId: z.number().nullish() }))
    .query(async ({ input }) => {
      if (!input.scribeId) return [];
      return await prisma.audioFile.findMany({
        where: { scribeId: input.scribeId },
        orderBy: { createdAt: "asc" },
      });
    }),

  updatePeaks: protectedProcedure
    .input(
      z.object({
        peaks: z.number().array(),
        audioFileId: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      await prisma.audioFile.update({
        where: { id: input.audioFileId },
        data: { peaks: input.peaks },
      });
    }),
});
