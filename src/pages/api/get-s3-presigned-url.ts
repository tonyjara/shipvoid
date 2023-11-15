import { getServerAuthSession } from "@/server/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { env } from "@/env.mjs";
import { appOptions } from "@/lib/Constants/AppOptions";

if (
  !env.AWS_ACCESS_KEY ||
  !env.AWS_SECRET_KEY ||
  !env.AWS_REGION ||
  !env.AWS_BUCKET_NAME
)
  throw new Error("AWS credentials not set");

const client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});

export default async function getSasToken(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "method not allowed" });
    }
    const session = await getServerAuthSession({ req, res });

    if (!session || appOptions.cloudStorageProvider !== "aws") {
      return res.status(401).json({ error: "unauthorized" });
    }

    const fileName = req.query.fileName as string | undefined;
    const fileType = req.query.fileType as string | undefined;
    if (!fileName || !fileType)
      throw new Error("fileName and fileType are required");

    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });
    const preSignedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600,
    });

    res.status(200).json({ preSignedUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
