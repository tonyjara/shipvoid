import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function downLoadEmailsList(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "method not allowed" });
    }

    const session = await getServerAuthSession({ req, res });

    if (!session || !session.user || session.user.role !== "admin") {
      return res.status(401).json({ error: "unauthorized" });
    }

    const emailsList = await prisma.mailingList.findMany({
      where: { hasUnsubscribed: false, hasConfirmed: true },
      select: { name: true, email: true },
    });
    if (!emailsList) {
      return res.status(404).json({ error: "not found" });
    }

    return res.status(200).json({ emailsList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
