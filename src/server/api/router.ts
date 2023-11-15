import { createTRPCRouter } from "@/server/api/trpc";
import { usersRouter } from "./routers/users.routes";
import { supportRoutes } from "./routers/support.routes";
import { adminRouter } from "./routers/admin.routes";
import { telegramRouter } from "./routers/telegram.routes";
import { stripeRouter } from "./routers/stripe.routes";
import { authRouter } from "./routers/auth.routes";
import { logsRouter } from "./routers/logs.routes";
import { accountsRouter } from "./routers/accounts.route";
import { releasesRouter } from "./routers/releases.routes";
import { mailingListRouter } from "./routers/mailingList.routes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  accounts: accountsRouter,
  admin: adminRouter,
  auth: authRouter,
  logs: logsRouter,
  mailingList: mailingListRouter,
  releases: releasesRouter,
  stripe: stripeRouter,
  support: supportRoutes,
  telegram: telegramRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
