import { siteData } from "@/lib/Constants";

import { MailerSend, Recipient, EmailParams, Sender } from "mailersend";
import {
  getNotifiedConfirmationEmailTemplate,
  passwordRecoveryEmailTemplate,
  verificationEmailTemmplate,
} from "./emailTemplates";

export interface MailSendParams {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  subject: string;
  html: string;
  text: string;
}

const env = process.env;

async function sendEmail(params: MailSendParams) {
  if (!env.MAILERSEND_API_TOKEN)
    return console.error("MAILERSEND_API_TOKEN is not defined");

  const recipients = [new Recipient(params.to, params.toName)];
  const sender = new Sender(params.from, params.fromName);

  const emailParams = new EmailParams({
    from: sender,
    to: recipients,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });

  const mailersend = new MailerSend({
    apiKey: env.MAILERSEND_API_TOKEN,
  });
  await mailersend.email.send(emailParams);
}

/** Managed through emailAdapters.ts */
export async function sendVerificationEmailFromMailerSend({
  email,
  name,
  link,
}: {
  email: string;
  name: string;
  link: string;
}) {
  await sendEmail({
    from: `signup@${siteData.mailDomain}`,
    fromName: `${siteData.appName}`,
    to: email,
    toName: name,
    subject: `${siteData.appName} - Verify your email address`,
    html: verificationEmailTemmplate({ link, name }),
    text: "Verify your email address",
  });
}

/** Managed through emailAdapters.ts */
export async function sendPasswordRecoveryEmailFromMailersend({
  email,
  name,
  link,
}: {
  email: string;
  name: string;
  link: string;
}) {
  //Html password recovery template
  await sendEmail({
    from: `password-reset@${siteData.mailDomain}`,
    fromName: `${siteData.appName}`,
    to: email,
    toName: name,
    subject: `${siteData.appName} - Password reset`,
    html: passwordRecoveryEmailTemplate({ link, name }),
    text: "Reset your password",
  });
}

/** Managed through emailAdapters.ts */
export async function sendGetNotifiedConfirmationEmailMailersend({
  email,
  name,
  unsubscribeId,
}: {
  email: string;
  name: string;
  unsubscribeId: string;
}) {
  //Html password recovery template
  await sendEmail({
    from: `donotreply@${siteData.mailDomain}`,
    fromName: `${siteData.appName}`,
    to: email,
    toName: name,
    subject: `Confirmation for ${siteData.appName} launch notification`,
    html: getNotifiedConfirmationEmailTemplate({ unsubscribeId, name }),
    text: "Reset your password",
  });
}
