import { TRPCError } from "@trpc/server";
import { prisma } from "./db";
import { appOptions } from "@/lib/Constants";

export const validateRecaptcha = async (reCaptchaToken: string) => {
  const captchaV2Secret = process.env.RE_CAPTCHA_SECRET_KEY;

  const result = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${captchaV2Secret}&response=${reCaptchaToken}`,
    {
      method: "POST",
    },
  );
  const captcha = await result.json();
  if (!captcha.success) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid Captcha",
    });
  }
};

export const createServerLog = async (
  message: string,
  level: string,
  eventId?: string,
) => {
  if (!appOptions.enableServerLogs) return;
  await prisma.logs.create({
    data: {
      message: message,
      level,
      eventId: eventId ?? "NONE",
    },
  });
  if (appOptions.deleteLogsAfterDays > 0) {
    await prisma.logs.deleteMany({
      where: {
        createdAt: {
          lte: new Date(
            Date.now() - appOptions.deleteLogsAfterDays * 24 * 60 * 60 * 1000,
          ),
        },
      },
    });
  }
};
