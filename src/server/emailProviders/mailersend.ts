import { MailerSend, Recipient, EmailParams, Sender } from "mailersend";
import { env } from "@/env.mjs";

export interface MailSendParams {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(params: MailSendParams) {
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
