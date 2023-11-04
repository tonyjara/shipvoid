import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";
import Decimal from "decimal.js";
import { verifySMTPConnection } from "@/server/emailProviders/nodemailer";

const isDev = process.env.NODE_ENV === "development";

export const adminRouter = createTRPCRouter({
  /** Simulate chat usage */

  verifySMTPconnection: adminProcedure.mutation(async () => {
    verifySMTPConnection();
  }),
});
