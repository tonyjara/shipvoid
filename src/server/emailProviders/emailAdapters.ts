/**INFO: In this file we discern what provider was chosen in flags and use the appropriate functions */

import { appOptions } from "@/lib/Constants/AppOptions";
import { sendEmail } from "./mailersend";
import { transporter } from "./nodemailer";
import {
  newsletterConfirmationTemplate,
  passwordRecoveryEmailTemplate,
  purchaseSuccesVerifyEmailTemplate,
  purchaseSuccesVerifyEmailTemplateAndScheduleOneOnOne,
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
  const mailData = {
    from: `signup@${siteData.mailDomain}`,
    to: email,
    subject: `${siteData.appName} - Verify your email address`,
    html: verificationEmailTemmplate({ link, name }),
  };

  return await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
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
  const mailData = {
    from: `signup@${siteData.mailDomain}`,
    to: email,
    subject: `${siteData.appName} - Verify your email address`,
    html: purchaseSuccesVerifyEmailTemplate({ link, name }),
  };

  return await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
}

//For first 50 customers
export async function sendPurchaseSuccessVerifyEmailWithOneOnOneLink({
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
      html: purchaseSuccesVerifyEmailTemplateAndScheduleOneOnOne({
        link,
        name,
      }),
      text: "Verify your email address",
    });
  }

  //Default to NODEMIALER
  const mailData = {
    from: `signup@${siteData.mailDomain}`,
    to: email,
    subject: `${siteData.appName} - Verify your email address`,
    html: purchaseSuccesVerifyEmailTemplateAndScheduleOneOnOne({ link, name }),
  };

  return await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
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
  const mailData = {
    from: `password-reset@${siteData.mailDomain}`,
    to: email,
    subject: `${siteData.appName} - Password reset`,
    html: passwordRecoveryEmailTemplate({ link, name }),
  };
  return await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
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
  const mailData = {
    from: `donotreply@${siteData.mailDomain}`,
    to: email,
    subject: `Confirmation for ${siteData.appName} newsletter`,
    html: newsletterConfirmationTemplate({ link, name }),
  };

  return await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
}
