/**INFO: In this file we discern what provider was chosen in flags and use the appropriate functions */

import { appOptions } from "@/lib/Constants";
import {
  sendGetNotifiedConfirmationEmailMailersend,
  sendPasswordRecoveryEmailFromMailersend,
  sendVerificationEmailFromMailerSend,
} from "./mailersend";
import {
  sendGetNotifiedConfirmationEmailNodeMailer,
  sendPasswordRecoveryEmailFromNodemailer,
  sendVerificationEmailFromNodemailer,
} from "./nodemailer";

export async function sendVerificationEmail({
  email,
  name,
  link,
}: {
  email: string;
  name: string;
  link: string;
}) {
  if (appOptions.emailProvider === "MAILERSEND") {
    return sendVerificationEmailFromMailerSend({ email, name, link });
  }

  //Default to NODEMIALER
  return sendVerificationEmailFromNodemailer({ email, name, link });
}

export async function sendPasswordRecoveryEmail({
  email,
  name,
  link,
}: {
  email: string;
  name: string;
  link: string;
}) {
  if (appOptions.emailProvider === "MAILERSEND") {
    return sendPasswordRecoveryEmailFromMailersend({ email, name, link });
  }

  //Default to NODEMIALER
  return sendPasswordRecoveryEmailFromNodemailer({ email, name, link });
}

export async function sendGetNotifiedConfirmationEmail({
  email,
  name,
  unsubscribeId,
}: {
  email: string;
  name: string;
  unsubscribeId: string;
}) {
  if (appOptions.emailProvider === "MAILERSEND") {
    return sendGetNotifiedConfirmationEmailMailersend({
      email,
      name,
      unsubscribeId,
    });
  }

  //Default to NODEMIALER
  return sendGetNotifiedConfirmationEmailNodeMailer({
    email,
    name,
    unsubscribeId,
  });
}
