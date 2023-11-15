import { createTransport } from "nodemailer";
import { env } from "@/env.mjs";

export const transporter = createTransport({
  host: env.SMTP_ENDPOINT,
  port: 465,
  /* secure: process.env.NODE_ENV === "development" ? false : true, */
  secure: true,
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
});

/** Managed through emailAdapters.ts */
// verify connection configuration
export const verifySMTPConnection = async () => {
  transporter.verify(function (error, success) {
    if (error) {
      console.error(error);
    } else {
      console.info(success);
      console.info("Server is ready to take our messages");
    }
  });
};
