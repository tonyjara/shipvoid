import { SupportTicket } from "@prisma/client"
import * as z from "zod"

export type FormSupportTicket = Pick<
    SupportTicket,
    "subject" | "message" | "imageUrl" | "imageName"
>

export const validateSupportTicket: z.ZodType<FormSupportTicket> = z.lazy(() =>
    z.object({
        subject: z
            .string()
            .min(1, "Please provide a subject")
            .max(255, "Subject is too long"),
        message: z
            .string()
            .min(1, "Please provide a message")
            .max(999, "Message is too long"),
        imageUrl: z.string().nullable(),
        imageName: z.string().nullable(),
    })
)

export const defaultSupportTicketValues: FormSupportTicket = {
    subject: "",
    message: "",
    imageUrl: null,
    imageName: null,
}
