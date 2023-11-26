import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { appOptions } from "./lib/Constants/AppOptions";

//@ts-ignore
const requiredIf = (condition) =>
  z
    .string()
    .optional()
    .refine((input) => (condition && !input?.length ? false : true));

const requiredIfTelegramEnabled = requiredIf(
  appOptions.enableTelegramNotifications,
);

const requiredIfAwsStorage = requiredIf(
  appOptions.cloudStorageProvider === "aws",
);
const requiredIfAzureStorage = requiredIf(
  appOptions.cloudStorageProvider === "azure",
);
const requiredIfNodeMailer = requiredIf(
  appOptions.emailProvider === "NODEMAILER",
);
const requiredIfMailerSend = requiredIf(
  appOptions.emailProvider === "MAILERSEND",
);
const requiredIfGoogleAnalyticsEnabled = requiredIf(
  appOptions.enableGoogleAnalytics,
);

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url(),
    ),

    /* GOOGLE_ANALYTICS_CLIENT_ID: requiredIfGoogleAnalyticsEnabled, */
    /* GOOGLE_ANALYTICS_CLIENT_SECRET: requiredIfGoogleAnalyticsEnabled, */

    JWT_SECRET: z.string().min(1),

    RE_CAPTCHA_SECRET_KEY: z.string().min(1),

    STORAGE_RESOURCE_NAME: requiredIfAzureStorage,
    AZURE_STORAGE_ACCESS_KEY: requiredIfAzureStorage,

    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),

    TELEGRAM_BOT_TOKEN: requiredIfTelegramEnabled,
    TELEGRAM_BOT_CHAT_ID: requiredIfTelegramEnabled,

    MAILERSEND_API_TOKEN: requiredIfMailerSend,

    //AWS SES
    SMTP_USERNAME: requiredIfNodeMailer,
    SMTP_PASSWORD: requiredIfNodeMailer,
    SMTP_ENDPOINT: requiredIfNodeMailer,

    //AWS SES
    AWS_ACCESS_KEY: requiredIfAwsStorage,
    AWS_SECRET_KEY: requiredIfAwsStorage,
    AWS_BUCKET_NAME: requiredIfAwsStorage,
    AWS_REGION: requiredIfAwsStorage,
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID:
      requiredIfGoogleAnalyticsEnabled,
    NEXT_PUBLIC_WEB_URL: z.string().min(1),
    NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,

    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,

    NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID,
    /* GOOGLE_ANALYTICS_CLIENT_ID: process.env.GOOGLE_ANALYTICS_CLIENT_ID, */
    /* GOOGLE_ANALYTICS_CLIENT_SECRET: process.env.GOOGLE_ANALYTICS_CLIENT_SECRET, */

    JWT_SECRET: process.env.JWT_SECRET,

    NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY:
      process.env.NEXT_PUBLIC_RE_CAPTCHA_SITE_KEY,
    RE_CAPTCHA_SECRET_KEY: process.env.RE_CAPTCHA_SECRET_KEY,

    STORAGE_RESOURCE_NAME: process.env.STORAGE_RESOURCE_NAME,
    AZURE_STORAGE_ACCESS_KEY: process.env.AZURE_STORAGE_ACCESS_KEY,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_BOT_CHAT_ID: process.env.TELEGRAM_BOT_CHAT_ID,

    MAILERSEND_API_TOKEN: process.env.MAILERSEND_API_TOKEN,

    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_ENDPOINT: process.env.SMTP_ENDPOINT,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
