import { siteData } from "@/lib/Constants/SiteData";

//NOTE: Unscibscribe link
/* <a href="${WEB_URL}/unsubscribe/${unsubscribeId}" style="background-color: #00bfa6; color: white; padding: 1rem; border-radius: 0.5rem; text-decoration: none; font-size: 1.2rem;">Unsubscribe</a> */

export const verificationEmailTemmplate = ({
  link,
  name,
}: {
  link: string;
  name: string;
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Account verification</title>
  </head>
  <body style="font-family: sans-serif; padding: 0.5rem">
    <h2>Hi ${name}, thanks for signing up to ${siteData.appName}.</h2>
    <p>Please verify your email by clicking the button below.</p>
    <br />
    <a
      href="${link}"
      style="
        background-color: #00bfa6;
        color: white;
        padding: 0.8rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-size: 1.2rem;
      "
      >Create account
    </a>
    <br />
    <br />
    <p>If this wasn't you no further action is required.</p>
    <p style="font-weight: bold">${siteData.appName}</p>
  </body>
</html>
    `;

export const purchaseSuccesVerifyEmailTemplate = ({
  link,
  name,
}: {
  link: string;
  name: string;
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Purchase confirmation</title>
  </head>
  <body style="font-family: sans-serif; padding: 0.5rem">
    <h2>Hi ${name}, thank you for your purchase.</h2>
    <p>
      Create an account to access your purchase by clicking the button below.
    </p>
    <br />
    <a
      href="${link}"
      style="
        background-color: #00bfa6;
        color: white;
        padding: 0.8rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-size: 1.2rem;
      "
      >Create account
    </a>
    <br />
    <br />
    <p>Join our discord channel here!</p>
    <br />
    <a
      href="${siteData.discordLink}"
      style="
        background-color: #00bfa6;
        color: white;
        padding: 0.8rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-size: 1.2rem;
      "
      >Discord
    </a>
    <br />
    <br />
    <p style="font-weight: bold">${siteData.appName}</p>
  </body>
</html>
   `;

export const purchaseSuccesVerifyEmailTemplateAndScheduleOneOnOne = ({
  link,
  name,
}: {
  link: string;
  name: string;
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Purchase confirmation</title>
  </head>
  <body style="font-family: sans-serif; padding: 0.5rem">
    <h2>Hi ${name}, thank you for your purchase.</h2>
    <p>
      Create an account to access your purchase by clicking the button below.
    </p>
    <br />
    <a
      href="${link}"
      style="
        background-color: #00bfa6;
        color: white;
        padding: 0.8rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-size: 1.2rem;
      "
      >Create account
    </a>
    <br />
    <br />
    <p>Join our discord channel here!</p>
    <br />
    <a
      href="${siteData.discordLink}"
      style="
        background-color: #00bfa6;
        color: white;
        padding: 0.8rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-size: 1.2rem;
      "
      >Discord
    </a>
    <br />
    <br />
    <br />
    <p>And because you where between the first 50 customers:</p>
    <br />
    <a
      href="${siteData.calendlyFirst50MeetsLink}"
      style="
        background-color: #00bfa6;
        color: white;
        padding: 0.8rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-size: 1.2rem;
      "
      >Schedule 2 hours one on one
    </a>
    <br />
    <br />
    <p style="font-weight: bold">${siteData.appName}</p>
  </body>
</html>
   `;

export const passwordRecoveryEmailTemplate = ({
  link,
  name,
}: {
  link: string;
  name: string;
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Password reset request</title>
  </head>
  <body style="font-family: sans-serif; padding: 0.5rem">
    <h2>Hi ${name}, we received a password reset request from this email.</h2>
    <p>Reset your password by clicking the button below</p>
    <br />
    <a
      href="${link}"
      style="
        background-color: #00bfa6;
        color: white;
        padding: 0.8rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-size: 1.2rem;
      "
      >Reset password
    </a>
    <br />
    <br />
    <p>If it wasn't you, no further action is required.</p>
    <p style="font-weight: bold">${siteData.appName}</p>
  </body>
</html>
    `;

export const newsletterConfirmationTemplate = ({
  link,
  name,
}: {
  link: string;
  name: string;
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Newsletter Subscription Confirmation</title>
  </head>
  <body style="font-family: sans-serif; padding: 0.5rem">
    <h1>Thank you for subscribing ${name}!</h1>
    <p>To confirm your subscription, please click the button down below</p>
    <br />
    <a
      href="${link}"
      style="
        background-color: #00bfa6;
        color: white;
        padding: 0.8rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-size: 1.2rem;
      "
      >Confirm
    </a>
    <br />
    <br />
    <p>
      If this wasn't you, it's safe to ignore this message. We won't email you again.
    </p>
    <p>Best regards,</p>
    <p style="font-weight: bold">${siteData.appName}</p>
  </body>
</html>
    `;
