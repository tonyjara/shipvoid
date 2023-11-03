import {
    StorageSharedKeyCredential,
    SASProtocol,
    AccountSASServices,
    AccountSASResourceTypes,
    AccountSASPermissions,
    generateAccountSASQueryParameters,
} from "@azure/storage-blob"

const accountName = process.env.STORAGE_RESOURCE_NAME!
const accountKey = process.env.AZURE_STORAGE_ACCESS_KEY!
if (!accountName) throw Error("Azure Storage accountName not found")
if (!accountKey) throw Error("Azure Storage accountKey not found")

const credentials = new StorageSharedKeyCredential(accountName, accountKey)

const createConnectionString = () => {
    const sasOptions = {
        services: AccountSASServices.parse("b").toString(), // blobs, tables, queues, files
        resourceTypes: AccountSASResourceTypes.parse("sco").toString(), // service, container, object
        // permissions: AccountSASPermissions.parse('rwdlacupi'), // permissions
        permissions: AccountSASPermissions.parse("rwd"), // permissions
        protocol:
            process.env.NODE_ENV === "development"
                ? SASProtocol.HttpsAndHttp
                : SASProtocol.Https,
        startsOn: new Date(),
        // expiresOn: new Date(new Date().valueOf() + 10 * 60 * 1000), // 10 minutes
        expiresOn: new Date(
            new Date().valueOf() + 60 * 60 * 24 * 365 * 50 * 1000
        ), // 50 years
    }

    const sasToken = generateAccountSASQueryParameters(
        sasOptions,
        credentials
    ).toString()

    return `https://${accountName}.blob.core.windows.net/?${sasToken}`
}

export const AS = {
    createConnectionString,
}
