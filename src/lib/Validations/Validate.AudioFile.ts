import { appOptions } from "@/lib/Constants";
import { AudioFile, CloudProviders } from "@prisma/client";
import * as z from "zod";

export const validateAudioFile: z.ZodType<AudioFile> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    name: z.string().min(1, { message: "Name is required" }),
    blobName: z.string(),
    url: z.string().min(1, { message: "URL is required" }),
    subscriptionId: z.string(),
    scribeId: z.number(),
    length: z.number(),
    duration: z.number(),
    type: z.string().min(1, { message: "Type is required" }),
    peaks: z.array(z.number()),
    cloudProvider: z.nativeEnum(CloudProviders),
  }),
);

export const defaultAudioFile: (props: { scribeId: number }) => AudioFile = ({
  scribeId,
}) => {
  const audioFile: AudioFile = {
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "",
    blobName: "",
    url: "",
    subscriptionId: "",
    scribeId,
    length: 0,
    duration: 0,
    type: "",
    peaks: [],
    cloudProvider: appOptions.cloudStorageProvider,
  };

  return audioFile;
};
