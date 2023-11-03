import { createTRPCRouter } from "@/server/api/trpc";
import { usersRouter } from "./routers/users.routes";
import { supportRoutes } from "./routers/support.routes";
import { adminRouter } from "./routers/admin.routes";
import { telegramRouter } from "./routers/telegram.routes";
import { transcriptionRouter } from "./routers/transcription.routes";
import { chatGPTRouter } from "./routers/chatGPT.routes";
import { stripeRouter } from "./routers/stripe.routes";
import { couponsRouter } from "./routers/coupons.routes";
import { stripeUsageRouter } from "./routers/stripe-usage.routes";
import { authRouter } from "./routers/auth.routes";
import { logsRouter } from "./routers/logs.routes";
import { accountsRouter } from "./routers/accounts.route";
import { scribesRouter } from "./routers/scribes.routes";
import { audioFileRouter } from "./routers/audioFile.routes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  accounts: accountsRouter,
  admin: adminRouter,
  audioFiles: audioFileRouter,
  auth: authRouter,
  users: usersRouter,
  support: supportRoutes,
  telegram: telegramRouter,
  transcriptions: transcriptionRouter,
  chatGPT: chatGPTRouter,
  stripe: stripeRouter,
  coupons: couponsRouter,
  scribe: scribesRouter,
  stripeUsage: stripeUsageRouter,

  logs: logsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
