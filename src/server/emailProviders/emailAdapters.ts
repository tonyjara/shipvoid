/**INFO: In this file we discern what provider was chosen in flags and use the appropriate functions */

import { appOptions } from "@/lib/Constants/AppOptions";
import { sendEmail } from "./mailersend";
import { transporter } from "./nodemailer";
import {
  newsletterConfirmationTemplate,
  passwordRecoveryEmailTemplate,
  purchaseSuccesVerifyEmailTemplate,
  verificationEmailTemmplate,
} from "./emailTemplates";
import { siteData } from "@/lib/Constants/SiteData";

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
    return await sendEmail({
      from: `signup@${siteData.mailDomain}`,
      fromName: `${siteData.appName}`,
      to: email,
      toName: name,
      subject: `${siteData.appName} - Verify your email address`,
      html: verificationEmailTemmplate({ link, name }),
      text: "Verify your email address",
    });
  }

  //Default to NODEMIALER
  return transporter.sendMail(
    {
      from: `signup@${siteData.mailDomain}`,
      to: email,
      subject: `${siteData.appName} - Verify your email address`,
      html: verificationEmailTemmplate({ link, name }),
    },
    (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.info("Email sent: " + info.response);
      }
    },
  );
}

//Sent when a user purchases a product, to verify the email
export async function sendPurchaseSuccessVerifyEmail({
  email,
  name,
  link,
}: {
  email: string;
  name: string;
  link: string;
}) {
  if (appOptions.emailProvider === "MAILERSEND") {
    /* return sendVerificationEmailFromMailerSend({ email, name, link }); */
    return await sendEmail({
      from: `verify@${siteData.mailDomain}`,
      fromName: `${siteData.appName}`,
      to: email,
      toName: name,
      subject: `${siteData.appName} - Verify your email address`,
      html: purchaseSuccesVerifyEmailTemplate({ link, name }),
      text: "Verify your email address",
    });
  }

  //Default to NODEMIALER
  return transporter.sendMail(
    {
      from: `signup@${siteData.mailDomain}`,
      to: email,
      subject: `${siteData.appName} - Verify your email address`,
      html: purchaseSuccesVerifyEmailTemplate({ link, name }),
    },
    (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.info("Email sent: " + info.response);
      }
    },
  );
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
    return await sendEmail({
      from: `password-reset@${siteData.mailDomain}`,
      fromName: `${siteData.appName}`,
      to: email,
      toName: name,
      subject: `${siteData.appName} - Password reset`,
      html: passwordRecoveryEmailTemplate({ link, name }),
      text: "Reset your password",
    });
  }

  //Default to NODEMIALER
  return transporter.sendMail(
    {
      from: `password-reset@${siteData.mailDomain}`,
      to: email,
      subject: `${siteData.appName} - Password reset`,
      html: passwordRecoveryEmailTemplate({ link, name }),
    },
    (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.info("Email sent: " + info.response);
      }
    },
  );
}

export async function sendNewsLetterConfirmationEmail({
  email,
  name,
  link,
}: {
  email: string;
  name: string;
  link: string;
}) {
  if (appOptions.emailProvider === "MAILERSEND") {
    return await sendEmail({
      from: `donotreply@${siteData.mailDomain}`,
      fromName: `${siteData.appName}`,
      to: email,
      toName: name,
      subject: `Confirmation for ${siteData.appName} newsletter`,
      html: newsletterConfirmationTemplate({ link, name }),
      text: "Reset your password",
    });
  }

  //Default to NODEMIALER
  return transporter.sendMail(
    {
      from: `donotreply@${siteData.mailDomain}`,
      to: email,
      subject: `Confirmation for ${siteData.appName} newsletter`,
      html: newsletterConfirmationTemplate({ link, name }),
    },
    (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.info("Email sent: " + info.response);
      }
    },
  );
}
