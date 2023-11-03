import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";
import { Deepgram } from "@deepgram/sdk";
import {
  calculateAudioMinutes,
  handleCreditUsageCalculation,
} from "./routeUtils/StripeUsageUtils";
import { checkIfTrialHasEnoughTranscriptionMinutes } from "./routeUtils/freeTrialUtils";
import { postAudioTranscriptionUsageToStripe } from "./routeUtils/PostStripeUsageUtils";
import Decimal from "decimal.js";

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

if (!deepgramApiKey) {
  throw new Error("Deepgram API key not set");
}

export const transcriptionRouter = createTRPCRouter({
  transcribeAudioFromScribe: protectedProcedure
    .input(
      z.object({
        scribeId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // 1. If subscription is trial, then check if they have used up their trial transcription usage, reject when not sufficient
      // 2. Calculate credit diff and post to stripe and db
      // 3. Transcribe audio
      // 4. Save transcription to db
      const subscription = await prisma.subscription.findUniqueOrThrow({
        where: { userId: ctx.session.user.id },
        include: { subscriptionItems: true },
      });
      const audioFile = await prisma.audioFile.findFirstOrThrow({
        where: { scribeId: input.scribeId },
        include: { scribe: true },
      });
      const durationInMinutes = calculateAudioMinutes(audioFile.duration);

      //1.
      const lastTranscriptionAction =
        await checkIfTrialHasEnoughTranscriptionMinutes({
          durationInMinutes,
          subscription,
        });

      //2.
      const postToDb = async (x: Decimal) =>
        await prisma.subscriptionCreditsActions.create({
          data: {
            amount: x,
            tag: "TRANSCRIPTION_MINUTE",
            prevAmount: lastTranscriptionAction?.currentAmount,
            currentAmount:
              lastTranscriptionAction?.currentAmount.sub(durationInMinutes),
            subscriptionId: subscription.id,
          },
        });

      const postToStripe = async (x: number) =>
        await postAudioTranscriptionUsageToStripe({
          durationInMinutes: x,
          subscription,
        });

      await handleCreditUsageCalculation({
        usageAmount: durationInMinutes,
        currentAmount: lastTranscriptionAction?.currentAmount,
        reportUsageToStripeFunc: postToStripe,
        discountFromCreditsFunc: postToDb,
      });

      //3.
      const deepgram = new Deepgram(deepgramApiKey);
      const req = await deepgram.transcription.preRecorded(
        {
          url: audioFile.url,
        },
        {
          detect_language: true,
          punctuate: true,
          /* detect_entities: true, */
          /* diarize: true, */
          /* smart_format: true, */
          /* paragraphs: true, */
          /* utterances: true, */
          /* detect_topics: true, //does not work */
          /* summarize: true, // works terribly */
        },
      );

      //4.
      const transcription =
        req.results?.channels[0]?.alternatives[0]?.transcript || "oops.";

      //If user has not added any content to the scribe, then set the userContent to the transcription
      if (audioFile.scribe?.userContent.length === 0) {
        await prisma.scribe.update({
          where: { id: input.scribeId },
          data: {
            transcription,
            userContent: transcription,
          },
        });
        return transcription;
      }

      await prisma.scribe.update({
        where: { id: input.scribeId },
        data: {
          transcription,
        },
      });

      return {
        transcription,
      };
    }),
});
