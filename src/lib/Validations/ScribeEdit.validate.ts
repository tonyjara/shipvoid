import { Scribe } from "@prisma/client";
import * as z from "zod";

export const validateScribeEdit: z.ZodType<Scribe> = z.lazy(() =>
  z.object({
    archived: z.boolean(),
    createdAt: z.date(),
    description: z.string(),
    id: z.number(),
    name: z
      .string()
      .min(1, { message: "Name must be at least 1 character" })
      .max(100, { message: "Name must be less than 100 characters" }),
    subscriptionId: z.string(),
    transcription: z.string(),
    updatedAt: z.date(),
    userContent: z.string(),
  }),
);

export const defaultScribeValues: Scribe = {
  archived: false,
  createdAt: new Date(),
  description: "",
  id: 0,
  name: "",
  subscriptionId: "",
  transcription: "",
  updatedAt: new Date(),
  userContent: "",
};
