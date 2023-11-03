import { createTransport } from "nodemailer";
import { siteData } from "@/lib/Constants";
import {
  getNotifiedConfirmationEmailTemplate,
  passwordRecoveryEmailTemplate,
  verificationEmailTemmplate,
} from "./emailTemplates";
import { env } from "@/env.mjs";

const transporter = createTransport({
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
export async function sendVerificationEmailFromNodemailer({
  email,
  name,
  link,
}: {
  email: string;
  name: string;
  link: string;
}) {
  const mailOptions = {
    from: `signup@${siteData.mailDomain}`,
    to: email,
    subject: `${siteData.appName} - Verify your email address`,
    html: verificationEmailTemmplate({ link, name }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.info("Email sent: " + info.response);
    }
  });
}

/** Managed through emailAdapters.ts */
export async function sendPasswordRecoveryEmailFromNodemailer({
  email,
  name,
  link,
}: {
  email: string;
  name: string;
  link: string;
}) {
  const mailOptions = {
    from: `password-reset@${siteData.mailDomain}`,
    to: email,
    subject: `${siteData.appName} - Password reset`,
    html: passwordRecoveryEmailTemplate({ link, name }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.info("Email sent: " + info.response);
    }
  });
}

/** Managed through emailAdapters.ts */
export async function sendGetNotifiedConfirmationEmailNodeMailer({
  email,
  name,
  unsubscribeId,
}: {
  email: string;
  name: string;
  unsubscribeId: string;
}) {
  const mailOptions = {
    from: `donotreply@${siteData.mailDomain}`,
    to: email,
    subject: `Confirmation for ${siteData.appName} launch notification`,
    html: getNotifiedConfirmationEmailTemplate({ unsubscribeId, name }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.info("Email sent: " + info.response);
    }
  });
}
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
