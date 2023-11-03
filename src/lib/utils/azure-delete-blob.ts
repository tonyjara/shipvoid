import type { ContainerClient } from "@azure/storage-blob";
import { BlobServiceClient } from "@azure/storage-blob";

export const deleteAzureBlob = async ({
  blobName,
  containerName,
  connectionString,
}: {
  blobName: string;
  containerName: string;
  connectionString: string;
}) => {
  const blobService = new BlobServiceClient(connectionString);

  // get Container - full public read access
  const containerClient: ContainerClient =
    blobService.getContainerClient(containerName);

  await containerClient.createIfNotExists({
    access: "container",
  });

  const blobClient = containerClient.getBlockBlobClient(blobName);

  return await blobClient.deleteIfExists({
    deleteSnapshots: "include",
  });
};
