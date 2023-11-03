import { env } from "@/env.mjs";
import { appOptions } from "@/lib/Constants";
import { Telegraf } from "telegraf";

const botToken = env.TELEGRAM_BOT_TOKEN;
const chatId = env.TELEGRAM_BOT_CHAT_ID;

const bot = botToken ? new Telegraf(botToken) : null;
const isDevEnv = env.NODE_ENV === "development";

export const postToTelegramGroup = async (email: string, message: string) => {
  if (!appOptions.enableTelegramNotifications) return;
  try {
    if (isDevEnv) return;

    if (!bot || !chatId || !appOptions.enableTelegramNotifications) return;
    await bot.telegram.sendMessage(chatId, `${email} has ${message}`);
  } catch (err) {
    console.error(err);
  }
};
