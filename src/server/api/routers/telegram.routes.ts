import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Telegraf } from "telegraf";
import { env } from "@/env.mjs";
import { z } from "zod";
import { appOptions } from "@/lib/Constants/AppOptions";

const botToken = env.TELEGRAM_BOT_TOKEN;
const chatId = env.TELEGRAM_BOT_CHAT_ID;

const bot = botToken ? new Telegraf(botToken) : null;

//  log this and paste the url on the browser to get your chatId
/* const botGetUpdatesUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getUpdates`; */

export const telegramRouter = createTRPCRouter({
  postToAnalyticsGroup: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (!bot || !chatId || !appOptions.enableTelegramNotifications) return;
      const user = ctx.session.user;
      await bot.telegram.sendMessage(
        chatId,
        `${user.email} has ${input.message}`,
      );
    }),
});
