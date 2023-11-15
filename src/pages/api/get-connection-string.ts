import { getServerAuthSession } from "@/server/auth";
import { createConnectionString } from "@/server/azure/blob-storage";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getSasToken(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "method not allowed" });

  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const sasToken = createConnectionString.put();

  res.status(200).json({ connectionString: sasToken });
}
