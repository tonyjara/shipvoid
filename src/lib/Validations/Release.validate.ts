import { DownloadableProduct, PlatformProduct } from "@prisma/client";
import * as z from "zod";

export const validateRelease: z.ZodType<DownloadableProduct> = z.lazy(() =>
  z.object({
    id: z.number(),
    active: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    title: z.string().min(1),
    content: z.string().min(50),
    containerName: z.string().min(1),
    blobName: z.string().min(1),
    platformProductName: z.nativeEnum(PlatformProduct),
  }),
);

export const defaultReleaseValues: DownloadableProduct = {
  id: 0,
  active: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  title: "",
  content: "",
  containerName: "",
  blobName: "",
  platformProductName: "TRANSCRIBELY",
};
