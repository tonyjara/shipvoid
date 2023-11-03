import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import OpenAI from "openai";
import { encode } from "gpt-tokenizer";
import { systemMessage } from "@/lib/Constants";
import { TRPCError } from "@trpc/server";
import { checkIfTrialHasEnoughChatCredits } from "./routeUtils/freeTrialUtils";
import { handleChatModel } from "./routeUtils/ChatRouteUtils";
import Decimal from "decimal.js";
import { saveChatUsageToDb } from "./routeUtils/CreditsUsageUtils";
import { postChatUsageToStripe } from "./routeUtils/PostStripeUsageUtils";
import { handleCreditUsageCalculation } from "./routeUtils/StripeUsageUtils";
import { SubscriptionCreditsActions } from "@prisma/client";
import { ChatCompletionMessage } from "openai/resources/chat";

export interface MessageSchema {
  role: "assistant" | "user" | "system";
  content: string;
}
export interface ChatResponse {
  index: number;
  message: MessageSchema;
  finish_reason: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatGPTRouter = createTRPCRouter({
  getScribeChat: protectedProcedure
    .input(z.object({ scribeId: z.number() }))
    .query(async ({ input }) => {
      if (!input.scribeId) {
        return [];
      }
      const chat = await prisma.scribeChat.findMany({
        where: {
          scribeId: input.scribeId,
        },
      });
      return chat.map((x) => ({
        role: x.role,
        content: x.content,
      }));
    }),

  chatInScribe: protectedProcedure
    .input(
      z.object({
        scribeId: z.number(),
        userContent: z.string().min(1),
        messages: z.array(
          z.object({
            role: z.string().min(1),
            content: z.string().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // 1. If subscription is trial, then check credits, reject when not sufficient
      // 2. Get chat completion
      // 3. Save chat completion to db
      // 4. Execute stripe and db usage handler

      const subscription = await prisma.subscription.findUniqueOrThrow({
        where: { userId: ctx.session.user.id },
        include: { subscriptionItems: true },
      });

      const tokenCountAverage = encode(input.userContent).length;
      const model = handleChatModel(tokenCountAverage);
      //1,
      const lastChatActions = await checkIfTrialHasEnoughChatCredits({
        tokenCountAverage,
        subscription,
        outputCutoff: 500,
      });

      //2.
      const chatCompletion = await openai.chat.completions.create({
        model,
        messages: [
          systemMessage,
          ...(input.messages as ChatCompletionMessage[]),
          { role: "user", content: input.userContent },
        ],
      });

      const response = chatCompletion.choices[0]?.message;
      /* data.choices[0]?.message; */
      if (!response?.content) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No response generated",
        });
      }

      //3.
      await prisma.scribeChat.create({
        data: {
          role: "user",
          content: input.userContent,
          scribeId: input.scribeId,
        },
      });
      await prisma.scribeChat.create({
        data: {
          role: "assistant",
          content: response.content,
          scribeId: input.scribeId,
        },
      });

      //4.
      /* const inputTokens = chatCompletion.data.usage?.prompt_tokens || 0; */
      const inputTokens = chatCompletion.usage?.prompt_tokens ?? 0;
      const outputTokens = chatCompletion.usage?.completion_tokens ?? 0;
      const { lastChatOuputAction, lastChatInputAction } = lastChatActions;
      await postChatInputAndOutputToStripeAndDb({
        subscription,
        inputTokens,
        outputTokens,
        lastChatInputAction,
        lastChatOuputAction,
      });

      return { role: response.role, content: response.content };
    }),
  clearScribeChat: protectedProcedure
    .input(z.object({ scribeId: z.number() }))
    .mutation(async ({ input }) => {
      await prisma.scribeChat.deleteMany({
        where: {
          scribeId: input.scribeId,
        },
      });
    }),
  summarizeUserContent: protectedProcedure
    .input(
      z.object({
        scribeId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // 1. If subscription is trial, then check credits, reject when not sufficient
      // 2. Get chat completion
      // 3. Execute stripe and db usage handler
      const subscription = await prisma.subscription.findUniqueOrThrow({
        where: { userId: ctx.session.user.id },
        include: { subscriptionItems: true },
      });

      const scribe = await prisma.scribe.findUniqueOrThrow({
        where: { id: input.scribeId },
      });

      //1.
      const tokenCountAverage = encode(scribe.transcription).length;
      const model = handleChatModel(tokenCountAverage);
      const lastChatActions = await checkIfTrialHasEnoughChatCredits({
        tokenCountAverage,
        subscription,
        outputCutoff: 1000,
      });

      //2.

      const content = `Using this transcription, auto detect the language and summarize it's content.  Return only content in HTML format. The show notes should be in the same language as the transcription. Here's the transcript: "${scribe.transcription}" `;

      const chatCompletion = await openai.chat.completions.create({
        model,
        messages: [systemMessage, { role: "user", content }],
      });

      const summary = chatCompletion.choices[0]?.message;
      if (!summary?.content) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No show notes generated",
        });
      }


      //3.
      const inputTokens = chatCompletion.usage?.prompt_tokens || 0;
      const outputTokens = chatCompletion.usage?.completion_tokens || 0;
      const { lastChatOuputAction, lastChatInputAction } = lastChatActions;
      await postChatInputAndOutputToStripeAndDb({
        subscription,
        inputTokens,
        outputTokens,
        lastChatInputAction,
        lastChatOuputAction,
      });

      return { summary: summary.content };
    }),

  prettifyUserContent: protectedProcedure
    .input(
      z.object({
        scribeId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // 1. If subscription is trial, then check credits, reject when not sufficient
      // 2. Get chat completion
      // 3. Execute stripe and db usage handler
      const subscription = await prisma.subscription.findUniqueOrThrow({
        where: { userId: ctx.session.user.id },
        include: { subscriptionItems: true },
      });

      const scribe = await prisma.scribe.findUniqueOrThrow({
        where: { id: input.scribeId },
      });

      //1.
      const tokenCountAverage = encode(scribe.transcription).length;
      const model = handleChatModel(tokenCountAverage);
      const lastChatActions = await checkIfTrialHasEnoughChatCredits({
        tokenCountAverage,
        subscription,
        outputCutoff: 1000,
      });

      //2.

      const content = `Make the folloing content look like a professional document "${scribe.userContent}", add headings, paragraphs, and bullet points if needed. Your response should be in html.`;
      const chatCompletion = await openai.chat.completions.create({
        model,
        messages: [systemMessage, { role: "user", content }],
      });

      const pretty = chatCompletion.choices[0]?.message;
      if (!pretty?.content) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No prettified content generated",
        });
      }

      //3.
      const inputTokens = chatCompletion.usage?.prompt_tokens || 0;
      const outputTokens = chatCompletion.usage?.completion_tokens || 0;
      const { lastChatOuputAction, lastChatInputAction } = lastChatActions;
      await postChatInputAndOutputToStripeAndDb({
        subscription,
        inputTokens,
        outputTokens,
        lastChatInputAction,
        lastChatOuputAction,
      });
      return { prettyContent: pretty.content };
    }),
});

export const postChatInputAndOutputToStripeAndDb = async ({
  subscription,
  inputTokens,
  outputTokens,
  lastChatInputAction,
  lastChatOuputAction,
}: {
  subscription: any;
  inputTokens: number;
  outputTokens: number;
  lastChatInputAction: SubscriptionCreditsActions | null;
  lastChatOuputAction: SubscriptionCreditsActions | null;
}) => {
  const postChatInputToDb = async (x: Decimal) =>
    await saveChatUsageToDb({
      tokens: x,
      subscriptionId: subscription.id,
      lastChatAction: lastChatInputAction,
      chatType: "CHAT_INPUT",
    });
  const postChatInputToStripe = async (x: number) =>
    await postChatUsageToStripe({
      subscription,
      usage: x,
      chatType: "CHAT_INPUT",
    });

  //Hanlde input credits and usage posting
  await handleCreditUsageCalculation({
    usageAmount: inputTokens,
    currentAmount: lastChatInputAction?.currentAmount,
    reportUsageToStripeFunc: postChatInputToStripe,
    discountFromCreditsFunc: postChatInputToDb,
  });

  //Chat Output
  const postChatOutputToDb = async (x: Decimal) =>
    await saveChatUsageToDb({
      tokens: x,
      subscriptionId: subscription.id,
      lastChatAction: lastChatOuputAction,
      chatType: "CHAT_OUTPUT",
    });
  const postChatOutputToStripe = async (x: number) =>
    await postChatUsageToStripe({
      subscription,
      usage: x,
      chatType: "CHAT_OUTPUT",
    });

  //Hanlde input credits and usage posting
  await handleCreditUsageCalculation({
    usageAmount: outputTokens,
    currentAmount: lastChatOuputAction?.currentAmount,
    reportUsageToStripeFunc: postChatOutputToStripe,
    discountFromCreditsFunc: postChatOutputToDb,
  });
};
