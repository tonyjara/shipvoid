import { env } from "@/env.mjs";
import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/db";
import {
  BlobServiceClient,
  ContainerSASPermissions,
  SASProtocol,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { PlatformProduct } from "@prisma/client";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
const isDevEnv = process.env.NODE_ENV === "development";

export default async function getSasToken(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "method not allowed" });
    }
    if (!env.STORAGE_RESOURCE_NAME || !env.AZURE_STORAGE_ACCESS_KEY)
      return res.status(500).json({ error: "no storage key" });
    const accountName = env.STORAGE_RESOURCE_NAME;

    const { containerName, blobName, platformProductName } = req.body as {
      containerName: string | undefined;
      blobName: string | undefined;
      platformProductName: string | undefined;
    };
    if (!containerName || !blobName || !platformProductName)
      return res.status(400).json({ error: "missing data" });

    const session = await getServerAuthSession({ req, res });

    if (!session) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const purchaseForProductExists = await prisma.purchaseIntent.findFirst({
      where: {
        userId: session.user.id,
        succeeded: true,
        platformProductName: platformProductName as PlatformProduct,
      },
    });

    if (!purchaseForProductExists) {
      return res.status(401).json({ error: "Product not purchased" });
    }

    // Generate a SAS token and contatenate it with the blob's URI.
    // Then stream the blob to the browser

    const credentials = new StorageSharedKeyCredential(
      env.STORAGE_RESOURCE_NAME,
      env.AZURE_STORAGE_ACCESS_KEY,
    );
    // Generate service level SAS for a container
    const containerSAS = generateBlobSASQueryParameters(
      {
        containerName: containerName.toLowerCase(), // Required
        blobName,
        permissions: ContainerSASPermissions.parse("r"), // Required
        startsOn: new Date(), // Optional
        expiresOn: new Date(new Date().valueOf() + 60000), // Required. Date type
        protocol: isDevEnv ? SASProtocol.HttpsAndHttp : SASProtocol.Https, // Optional
      },
      credentials, // StorageSharedKeyCredential - `new StorageSharedKeyCredential(account, accountKey)`
    ).toString();

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credentials,
    );

    const containerClient = blobServiceClient.getContainerClient(
      containerName.toLowerCase(),
    );
    const blobClient = containerClient.getBlobClient(blobName);

    const sasUrl = `${blobClient.url}?${containerSAS}`;

    const { data } = await axios.get(sasUrl, { responseType: "stream" });

    res.setHeader("content-disposition", `attachment; filename="${blobName}"`);

    data.pipe(res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
