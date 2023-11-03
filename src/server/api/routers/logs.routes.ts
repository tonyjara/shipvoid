import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";

export const logsRouter = createTRPCRouter({
  getLogs: adminProcedure.query(async () => {
    return await prisma.logs.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
  clearAllLogs: adminProcedure.mutation(async () => {
    return await prisma.logs.deleteMany();
  }),
});
