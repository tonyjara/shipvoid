import type { ContainerClient } from "@azure/storage-blob"
import { BlobServiceClient } from "@azure/storage-blob"

// AllowedOrigins: ['*'],
// AllowedMethods: ['GET'],
// AllowedHeaders: [],
// ExposedHeaders: [],
// MaxAgeInSeconds: 60

export const uploadFileToBlobStorage = async ({
    file,
    containerName,
    fileName,
    connectionString,
    onProgress,
}: {
    file: File | null
    containerName: string
    fileName: string
    connectionString: string
    onProgress?: (progress: number) => void
}): Promise<string | null> => {
    if (!file) return null

    const blobService = new BlobServiceClient(connectionString)
    blobService.setProperties({
        cors: [
            {
                allowedOrigins: "*",
                allowedMethods: "PUT",
                allowedHeaders: "*",
                exposedHeaders: "*",
                maxAgeInSeconds: 60,
            },
        ],
    })

    // get Container - full public read access
    const containerClient: ContainerClient =
        blobService.getContainerClient(containerName)

    await containerClient.createIfNotExists({
        access: "container",
    })

    const blobClient = containerClient.getBlockBlobClient(fileName)

    // upload file
    await blobClient.uploadData(file, {
        blobHTTPHeaders: { blobContentType: file.type },
        onProgress: (progress) => {
            onProgress && onProgress(progress.loadedBytes)
        },
    })
    const client = containerClient.getBlobClient(fileName)
    //build a url
    return client.url
    //This below did not work, it messed up the usability of th url
    /* const cleanUrl = `https://${client.accountName}.blob.core.windows.net/${client.containerName}/${client.name}` */
    /**/
    /* return cleanUrl */
}
