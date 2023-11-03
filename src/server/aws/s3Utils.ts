import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "@/env.mjs";

export const deleteS3Object = async ({ key }: { key: string }) => {
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
  const command = new DeleteObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
  });

  try {
    await client.send(command);
  } catch (err) {
    console.error(err);
    throw new Error("Error deleting object ");
  }
};
